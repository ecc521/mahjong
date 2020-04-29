class Tile {
	constructor(config = {}) {
		this.type = config.type //Ex. wind, bamboo, character, pretty, dragon
		this.value = config.value //Ex. 1,3 red, west

		if (config.faceDown) {
			this.faceDown = true
			this.imageUrl = "assets/tiles/face-down.png"
		}
		else {
			this.imageUrl = "assets/tiles/" + this.type + "s" + "/" + this.value + ".png"
		}

		this.matches = function(tile) {
			if (this.faceDown) {return false}
			if (tile.type = this.type && tile.value === this.value) {return true}
			return false
		}

		this.isDouble = function(userWind) {return 0}
		this.getPoints = function() {return 0}

		this.toJSON = (function() {
			let obj = {}
			obj.class = "Tile"
			obj.type = this.type
			obj.value = this.value
			if (this.faceDown) {obj.faceDown = this.faceDown}

			return JSON.stringify(obj)
		}).bind(this)

		this.isSequence = false
		this.isPongOrKong = false
		this.isPair = false
	}

	static fromJSON(str) {
		let obj = JSON.parse(str)
		if (obj.class !== "Tile") {throw "String was not created by Tile.toJSON()"}
		return new Tile(obj)
	}
}

module.exports = Tile
