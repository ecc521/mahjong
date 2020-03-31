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

	this.renderTiles = function(handToRender, handForExposed, dragstart) {
		//handForExposed - Optional. If exposed tiles should be placed in a seperate hand, they will be placed here.
		//dragstart - Optional. If passed, the function will be added to the dragstart event, and the draggable attribute will be set.
		//dragstart does not apply for tiles in handForExposed, if it exists.

		while (handToRender.firstChild) {handToRender.firstChild.remove()} //Delete everything currently rendered in the hand.

		let tiles = []

		for (let i=0;i<this.contents.length;i++) {
			let item = this.contents[i]
			if (item instanceof Tile || item instanceof Pretty)	{
				tiles.push(item)
			}
			else if (item instanceof Match || item instanceof Sequence) {
				let items = item.tiles
				items.forEach((value) => {value.tempExposed = item.exposed})
				tiles = tiles.concat(items)
			}
			else {console.error("Unknown item " + item)}
		}

		for (let i=0;i<tiles.length;i++) {
			let tile = tiles[i]
			let elem = document.createElement("img")
			elem.src = tile.imageUrl

			if (tile.tempExposed && handForExposed) {
				handForExposed.appendChild(elem)
			}
			else {
				if (dragstart instanceof Function) {
					elem.draggable = true
					elem.addEventListener("dragstart", dragstart)
				}

				handToRender.appendChild(elem)
			}
			delete tile.tempExposed
		}
	}
}

module.exports = Hand
