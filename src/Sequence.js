function Sequence(config = {}) {
	if (config.exposed === undefined) {throw "config.exposed must not be undefined. "}

	this.isDouble = function(userWind) {return false}
	this.getPoints = function() {return 0}

	if (!config.tiles instanceof Array) {throw "config.tiles must be an array of Tiles"}
	this.tiles = config.tile

	//Sort the sequence.
	this.tiles = this.tiles.sort(function(tile1, tile2) {
		return tile1.value - tile2.value
	})

	this.exposed = exposed
	this.isSequence = true
	this.isPongOrKong = false
	this.isPair = false
}


function isValidSequence(tiles) {
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


module.exports = {
	Sequence,
	isValidSequence
}
