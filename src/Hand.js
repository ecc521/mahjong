const Tile = require("./Tile.js")
const Match = require("./Match.js")
const Sequence = require("./Sequence.js")
const Pretty = require("./Pretty.js")
const Wall = require("./Wall.js")

class Hand {
	constructor(config = {}) {
		//handForExposed - Optional. If exposed tiles should be placed in a seperate hand, they will be placed here.
		//interactive: Can the user drag and drop to reorder?
		//tilePlacemat: Element that will allow user to select tiles to expose.
		this.handToRender = config.handToRender
		this.handForExposed = config.handForExposed
		this.tilePlacemat = config.tilePlacemat
		this.interactive = config.interactive || false
		this.wind = config.wind

		//We will also have one events: this.onPlacematChange

		this.contents = [] //Contents of hand.
		this.inPlacemat = [] //Additional contents of hand. In placemat.

		this.syncContents = (require("./Hand/syncContents.js")).bind(this)
		this.score = (require("./Hand/score.js")).bind(this)
		this.getClearHandDoubles = (require("./Hand/getClearHandDoubles.js")).bind(this)
		this.isMahjong = (require("./Hand/isMahjong.js")).bind(this)
		this.isCalling = (require("./Hand/isCalling.js")).bind(this)


		this.add = (function(obj) {
			//We will insert the tile where our sorting algorithm would find it most appropriate.
			//TODO: this should probably receive some improvement, as if the user changes the location of suits, or puts, say honors first, it will fail to properly insert.
			let newItemScore;
			if (obj instanceof Sequence) {
				newItemScore = Hand.getTileValue(obj.tiles[0]) //Use value of first tile in sequence.
			}
			else {
				newItemScore = Hand.getTileValue(obj)
			}

			for (let i=0;i<this.contents.length;i++) {
				//Find where to insert this tile.
				let currentItem = this.contents[i]
				if (currentItem instanceof Sequence) {
					//Not quite sure how to handle this.
					currentItem = currentItem.tiles[2] //Get the value using the last tile in sequence.
				}
				let currentScore = Hand.getTileValue(currentItem) //Value of the tile in that position

				if (newItemScore < currentScore) {
					this.contents.splice(i, 0, obj)
					return
				}
			}
			this.contents.push(obj)
		}).bind(this)

		this.remove = (function(obj) {
			let index = this.contents.findIndex((value) => {return value === obj})
			let placematIndex = this.inPlacemat.findIndex((value) => {return value === obj})
			if (index !== -1) {
				this.contents.splice(index, 1)
			}
			else if (placematIndex !== -1) {
				this.inPlacemat.splice(placematIndex, 1)
			}
			else {throw obj + " does not exist in hand. "}
		}).bind(this)

		this.removeMatchingTile = (function(obj) {
			//Removes a Tile that matches the object passed, although may not be the same objet.
			if (!obj instanceof Tile) {throw "removeMatchingTile only supports Tiles"}
			if (this.inPlacemat.length > 0) {console.warn("Hand.removeMatchingTile is intended for server side use only. ")}
			if (this.contents.some(((item, index) => {
				if (obj.matches(item)) {
					this.contents.splice(index, 1)
					return true
				}
				return false
			}).bind(this))) {return true}
			return false
		})

		this.getExposedTiles = (function(includeFaceDown = false) {
			let exposedTiles = []
			this.contents.forEach((item) => {
				if (item.exposed) {
					exposedTiles.push(item)
				}
				else if (item instanceof Match && item.amount === 4) {
					//If it is stored as a match, but not exposed, is in hand kong.
					//Is not stored as a match if the user never placed them downw
					exposedTiles.push(item)
				}
				else if (includeFaceDown) {
					exposedTiles.push(new Tile({faceDown: true}))
				}
			})
			return exposedTiles
		}).bind(this)

		function allowDrop(ev) {
			ev.preventDefault();
		}

		function dragstart(ev) {
			let randomClass = "randomClassForTransfer" + (2**53) * Math.random()
			ev.target.classList.add(randomClass)
			ev.dataTransfer.setData("randomClass", randomClass);
		}

		let dropOnHand = (function dropOnHand(ev) {
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

			let currentTile;
			if (elem.placematIndex !== undefined) {
				//We are dragging out of the placemat, into the hand.
				if (elem.placematIndex === 0 && this.inPlacemat[0].evicting) {
					console.log("Blocked dragging of evictingThrownTile")
					alert("You can't bring the thrown tile into your hand. You can only place it down along with other tiles that match it or form a sequence. ")
					return;
				}
				currentTile = this.inPlacemat.splice(elem.placematIndex, 1)[0]
			}
			else {
				//Reordering hand.
				currentTile = this.contents.splice(elem.tileIndex, 1)[0]
			}

			if (targetIndex <= this.contents.length) {
				let newTargetIndex = this.contents.findIndex((tile) => {return targetTile === tile})

				this.contents.splice(newTargetIndex, 0, currentTile)
			}
			else {
				this.contents.push(currentTile)
			}

			this.renderTiles() //Re-render.
		}).bind(this)

		let dropOnPlacemat = (function dropOnPlacemat(ev) {
			ev.preventDefault();
			let randomClass = ev.dataTransfer.getData("randomClass");
			let elem = document.getElementsByClassName(randomClass)[0]
			elem.classList.remove(randomClass)

			let currentTile = this.contents[elem.tileIndex]

			if (!currentTile) {return}

			if (this.inPlacemat.length >= 4) {
				alert("Placemat is already full. ")
				return
			}
			else {
				this.inPlacemat.push(this.contents.splice(elem.tileIndex, 1)[0])
			}
			this.renderTiles()


		}).bind(this)

		if (this.interactive) {
			this.handToRender.addEventListener("dragover", allowDrop)
			this.handToRender.addEventListener("dragenter", allowDrop)
			this.handToRender.addEventListener("drop", dropOnHand)

			if (this.tilePlacemat) {
				this.tilePlacemat.addEventListener("dragover", allowDrop)
				this.tilePlacemat.addEventListener("dragenter", allowDrop)
				this.tilePlacemat.addEventListener("drop", dropOnPlacemat)

				this.tilePlacemat.addEventListener("dragover", function() {
					this.style.backgroundColor = "lightblue"
				})
				this.tilePlacemat.addEventListener("dragleave", function() {
					this.style.backgroundColor = ""
				})
				this.tilePlacemat.addEventListener("drop", function() {
					this.style.backgroundColor = ""
				})
			}
		}


		this.removeMatchingTilesFromHand = (function removeMatchingTilesFromHand(obj, amount = 1, simulated = false) {
			return this.removeTilesFromHand(new Array(amount).fill(obj), simulated)
		}).bind(this)

		this.removeTilesFromHand = (function removeTilesFromHand(tiles, simulated = false) {
			if (tiles instanceof Sequence) {tiles = tiles.tiles}
			if (tiles instanceof Tile) {tiles = [tiles]}

			//We will verify that the tiles CAN be removed before removing them.
			let indexes = []
			tiles.forEach((tile, index) => {
				for (let i=this.contents.length-1;i>=0;i--) {
					if (tile.matches(this.contents[i]) && !indexes.includes(i)) {
						indexes[index] = i
						return
					}
				}
			})

			let allDefined = true
			for (let i=0;i<tiles.length;i++) {
				if (indexes[i] === undefined) {
					allDefined = false
				}
			}
			if (allDefined) {
				if (simulated) {return true}
				//Remove the item the farthest back in the hand to avoid position shifting.
				indexes.sort((a,b) => {return b-a}).forEach((index) => {
					this.contents.splice(index, 1)
				})
				return true
			}
			else {return false}
		}).bind(this)

		this.renderPlacemat = (function(classForFirst) {
			while (this.tilePlacemat.firstChild) {this.tilePlacemat.firstChild.remove()} //Delete everything currently rendered in the hand.

			for (let i=0;i<4;i++) {
				let tile = this.inPlacemat[i]
				let elem = document.createElement("img")
				if (i === 0 && classForFirst) {
					elem.className = classForFirst
				}
				if (tile) {
					elem.src = tile.imageUrl
					//Both work. Using i is faster and simpler.
					elem.placematIndex = i //this.inPlacemat.findIndex((item) => {return item === tile})
					elem.addEventListener("dragstart", dragstart)
				}
				else {
					elem.src = "assets/tiles/tile-outline.png"
				}
				this.tilePlacemat.appendChild(elem)
			}


		}).bind(this)

		this.setEvictingThrownTile = (function(tile) {
			//Clear the other evicting tile, even if it's position has moved due to some glitch or user hacking.
			for (let i=this.inPlacemat.length - 1;i>=0;i--) {
				let item = this.inPlacemat[i]
				if (item.evicting) {
					this.inPlacemat.splice(i, 1)
				}
			}
			if (tile) {
				if (this.inPlacemat.length >= 4) {
					this.contents.push(this.inPlacemat.pop())
				}
				this.inPlacemat.unshift(tile)
				tile.evicting = true
			}
		}).bind(this)

		this.renderTiles = (function() {

			if (!this.handToRender) {throw "Unable to render hand. You must pass config.handToRender to the constructor. "}

			while (this.handToRender.firstChild) {this.handToRender.firstChild.remove()} //Delete everything currently rendered in the hand.
			if (this.handForExposed) {
				while (this.handForExposed.firstChild) {this.handForExposed.firstChild.remove()} //Delete everything currently rendered in the hand.
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
					let items = item.tiles;
					if (item instanceof Match) {
						if (item.amount === 4) {
							//kong. Flip 1 tile.
							items[0] = new Tile({faceDown: true})
						}
					}
					if (item.exposed) {
						exposedTiles = exposedTiles.concat(items)
					}
					else {
						if (item instanceof Match && item.amount === 4) {
							//In hand kong. Expose with 2 flipped tiles. (One already flipped)
							items[3] = new Tile({faceDown: true})
							exposedTiles = exposedTiles.concat(items)
						}
						else {
							console.log(items)
							unexposedTiles = unexposedTiles.concat(items)
						}
					}
				}
				else {console.error("Unknown item " + item)}
			}

			let drawTiles = (function drawTiles(tiles, type) {
				for (let i=0;i<tiles.length;i++) {
					let tile = tiles[i]
					let elem = document.createElement("img")
					elem.src = tile.imageUrl

					if (type === "exposed" && this.handForExposed) {
						this.handForExposed.appendChild(elem)
					}
					else if (type === "exposed") {
						this.handToRender.appendChild(elem)
					}
					else if (type === "unexposed"){
						if (this.interactive) {
							elem.draggable = true
							elem.addEventListener("dragstart", dragstart)
							elem.tileIndex = this.contents.findIndex((item) => {return item === tile})
						}
						this.handToRender.appendChild(elem)
					}
				}
			}).bind(this)

			drawTiles(exposedTiles, "exposed")
			drawTiles(unexposedTiles, "unexposed")
			if (this.tilePlacemat) {
				this.renderPlacemat()
			}
		}).bind(this)

		this.getStringContents = (function(prop = "contents") {
			//Can also pass "inPlacemat" for placemat contents.
			return this[prop].map((item) => {return item.toJSON()})
		}).bind(this)

		this.toJSON = (function() {
			return JSON.stringify({
				wind: this.wind,
				contents: this.contents
			})
		}).bind(this)
	}

	static getTileValue(tile) {
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
		else if (!tile.faceDown) {console.error("Couldn't fully calculate value for " + tile)}
		return tileValue
	}

	static sortTiles(tiles) {
		return tiles.sort(function (tile1, tile2) {
			return Hand.getTileValue(tile1) - Hand.getTileValue(tile2)
		})
	}

	static convertStringsToTiles(arr) {
		//arr is an array, with the stringified contents of the hand.
		let contents = arr.map((itemStr) => {
			let obj = JSON.parse(itemStr)
			if (obj.class === "Pretty") {
				return Pretty.fromJSON(itemStr)
			}
			else if (obj.class === "Tile") {
				return Tile.fromJSON(itemStr)
			}
			else if (obj.class === "Sequence") {
				return Sequence.fromJSON(itemStr)
			}
			else if (obj.class === "Match") {
				return Match.fromJSON(itemStr)
			}
			else {throw "Unable to identify itemString " + itemStr}
		})
		return contents
	}

	static fromString(str) {
		//Hand.fromString is only meant to be used on the server side. Therefore, it will not attempt to carry over any functionality that would be client side.
		let obj = JSON.parse(str)
		let wind = obj.wind

		let hand = new Hand({wind: obj.wind})
		hand.contents = Hand.convertStringsToTiles(obj.contents)
		return hand
	}
}

module.exports = Hand
