function Tile(config = {}) {
	this.type = config.type //Ex. wind, bamboo, character, pretty, dragon
	this.value = config.value //Ex. 1,3 red, west

	this.imageUrl = "assets/tiles/" + this.type + "s" + "/" + this.value + ".png"

	this.matches = function(tile) {
		if (tile.type = this.type && tile.value === this.value) {return true}
		return false
	}

	this.isDouble = function(userWind) {return 0}
	this.getPoints = function() {return 0}

	this.isSequence = false
	this.isPongOrKong = false
	this.isPair = false
}

module.exports = Tile
