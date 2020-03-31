function Tile(config = {}) {
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

	this.isSequence = false
	this.isPongOrKong = false
	this.isPair = false
}

module.exports = Tile
