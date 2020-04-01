const Tile = require("./Tile.js")

class Sequence {
	constructor(config = {}) {
		if (config.exposed === undefined) {throw "config.exposed must not be undefined. "}

		this.isDouble = function(userWind) {return false}
		this.getPoints = function() {return 0}

		if (!config.tiles instanceof Array) {throw "config.tiles must be an array of Tiles"}
		this.tiles = config.tiles

		//Sort the sequence.
		this.tiles = this.tiles.sort(function(tile1, tile2) {
			return tile1.value - tile2.value
		})

		this.exposed = exposed
		this.isSequence = true
		this.isPongOrKong = false
		this.isPair = false

		this.toString = (function() {
			let obj = {}
			obj.class = "Sequence"
			obj.exposed = this.exposed
			obj.tiles = this.tiles

			return JSON.stringify(obj)
		}).bind(this)
	}

	static isValidSequence(tiles) {
		let type = tiles[0].type
		let values = []

		if (!["bamboo", "character", "circle"].includes(type)) {
			return false
		}

		//Sort the sequence.
		tiles = tiles.sort(function(tile1, tile2) {
			return tile1.value - tile2.value
		})

		for (let i=1;i<tiles.length;i++) {
			let tile = tiles[i]
			if (tile.type !== type) {return false} //Tiles are not the same suit.
			if (Math.abs(tiles[i-1].value - tile.value) !== 1) {return false} //Tiles are not in a sequence. There is a difference between the values that is not 1.
		}

		return true
	}

	static fromString(str) {
		let obj = JSON.parse(str)
		if (obj.class !== "Sequence") {throw "String was not created by Sequence.toString()"}

		obj.tiles = obj.tiles.map((tileString) => {
			return Tile.fromString(tileString)
		})

		return new Sequence(obj)
	}
}

module.exports = Sequence
