function Tile(config) {
	this.type = config.type //Ex. wind, bamboo, character, pretty, dragon
	this.value = config.value //Ex. 1,3 red, west

	this.matches = function(tile) {
		if (tile.type = this.type && tile.value === this.value) {return true}
		return false
	}
}

module.exports = Tile
