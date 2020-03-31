const Tile = require("./Tile.js")
const Match = require("./Match.js")
const Sequence = require("./Sequence.js").Sequence
const Pretty = require("./Pretty.js")

function Hand() {
	this.contents = []

	this.add = function(obj) {
		//We will insert the tile where our sorting algorithm would find it most appropriate.
		//TODO: this should probably receive some improvement, as if the user changes the location of suits, or puts, say honors first, it will fail to properly insert.
		let newItemScore;
		if (obj instanceof Sequence) {
			newItemScore = getTileValue(obj.tiles[0]) //Use value of first tile in sequence.
		}
		else {
			newItemScore = getTileValue(obj)
		}

		for (let i=0;i<this.contents.length;i++) {
			//Find where to insert this tile.
			let currentItem = this.contents[i]
			if (currentItem instanceof Sequence) {
				//Not quite sure how to handle this.
				currentItem = currentItem.tiles[2] //Get the value using the last tile in sequence.
			}
			let currentScore = getTileValue(currentItem) //Value of the tile in that position

			if (newItemScore < currentScore) {
				this.contents.splice(i, 0, obj)
				return
			}
		}
		this.contents.push(obj)
	}

	this.remove = function(obj) {
		let index = this.contents.findIndex((value) => {return value === obj})
		if (index) {
			this.contents.splice(index, 1)
		}
		else {throw obj + " does not exist in hand. "}
	}

	function getTileValue(tile) {
		//The greater the value, the further to the right we place the tile.
		let tileValue = 0

		tileValue += 100 * ["pretty", "circle", "bamboo", "character", "wind", "dragon"].findIndex((suit) => {return tile.type === suit})

		if (typeof tile.value === "number") {tileValue += tile.value}
		else if (tile.type === "wind") {
			tileValue += 10 * ["north", "east", "south", "west"].findIndex((value) => {return tile.value === value})
		}
		else if (tile.type === "dragon") {
			tileValue += 10 * ["red", "green", "white"].findIndex((value) => {return tile.value === value})
		}
		else {console.error("Couldn't fully calculate value for " + tile)}
		return tileValue
	}

	this.sortTiles = function(tiles) {
		tiles.sort(function (tile1, tile2) {
			return getTileValue(tile1) - getTileValue(tile2)
		})
	}

	this.renderTiles = function(handToRender, handForExposed, interactive) {
		//handForExposed - Optional. If exposed tiles should be placed in a seperate hand, they will be placed here.
		//dragstart - Optional. If passed, tiles can be dragged and dropped to reorder the hand.
		//dragstart does not apply for tiles in handForExposed, if it exists.

		function allowDrop(ev) {
			ev.preventDefault();
		}

		function dragstart(ev) {
			let randomClass = "randomClassForTransfer" + (2**53) * Math.random()
			ev.target.classList.add(randomClass)
			ev.dataTransfer.setData("randomClass", randomClass);
		}

		let drop = (function drop(ev) {
			ev.preventDefault();
			let randomClass = ev.dataTransfer.getData("randomClass");
			let elem = document.getElementsByClassName(randomClass)[0]
			elem.classList.remove(randomClass)

			let dropPosition = ev.x
			let targetBounds = ev.target.getBoundingClientRect()

			let targetIndex = ev.target.tileIndex

			if (targetBounds.right - ev.x < targetBounds.width/2) {
				//Dropped on right side of tile. Insert after.
				targetIndex++
			}

			let targetTile = this.contents[targetIndex]
			let currentTile = this.contents.splice(elem.tileIndex, 1)[0]

			if (targetIndex <= this.contents.length) {
				let newTargetIndex = this.contents.findIndex((tile) => {return targetTile === tile})

				this.contents.splice(newTargetIndex, 0, currentTile)
			}
			else {
				this.contents.push(currentTile)
			}

			this.renderTiles(handToRender, handForExposed, interactive) //Re-render.
		}).bind(this)

		//TODO: Use addEventListener, but make sure to avoid having multiple identical listeners.
		if (interactive) {
			handToRender.ondragover = allowDrop
			handToRender.ondrop = drop
		}

		while (handToRender.firstChild) {handToRender.firstChild.remove()} //Delete everything currently rendered in the hand.
		if (handForExposed) {
			while (handForExposed.firstChild) {handForExposed.firstChild.remove()} //Delete everything currently rendered in the hand.
		}

		let unexposedTiles = []
		let exposedTiles = []

		for (let i=0;i<this.contents.length;i++) {
			let item = this.contents[i]
			if (item instanceof Tile)	{
				unexposedTiles.push(item)
			}
			else if (item instanceof Pretty) {
				exposedTiles.push(item)
			}
			else if (item instanceof Match || item instanceof Sequence) {
				let items = item.tiles.slice(0) //Clone, as we modify for kongs.
				if (item.exposed) {
					if (item instanceof Match && item.amount === 4) {
						//kong. Flip 1 tile.
						items[0] = new Tile({faceDown: true})
					}
					exposedTiles = tiles.concat(items)
				}
				else {
					if (item instanceof Match && item.amount === 4) {
						//In hand kong. Expose with 2 flipped tiles.
						items[0] = new Tile({faceDown: true})
						items[3] = new Tile({faceDown: true})
						exposedTiles.concat(items)
					}
					else {
						unexposedTiles = tiles.concat(items)
					}
				}
			}
			else {console.error("Unknown item " + item)}
		}

		let drawTiles = (function drawTiles(tiles, exposed) {
			for (let i=0;i<tiles.length;i++) {
				let tile = tiles[i]
				let elem = document.createElement("img")
				elem.src = tile.imageUrl

				if (exposed && handForExposed) {
					handForExposed.appendChild(elem)
				}
				else if (exposed) {
					handToRender.appendChild(elem)
				}
				else {
					if (interactive) {
						elem.draggable = true
						elem.addEventListener("dragstart", dragstart)
						elem.tileIndex = this.contents.findIndex((item) => {return item === tile})
					}
					handToRender.appendChild(elem)
				}
			}
		}).bind(this)
		drawTiles(exposedTiles, true)
		drawTiles(unexposedTiles, false)
	}
}

module.exports = Hand
