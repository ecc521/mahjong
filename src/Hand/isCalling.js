const Sequence = require("../Sequence.js")
const Pretty = require("../Pretty.js")
const Wall = require("../Wall.js")
const Match = require("../Match.js")
const Tile = require("../Sequence.js")
const Hand = require("../Hand.js")

function isCalling(discardPile, unlimitedSequences) {
	//This determines if, from the player's point of view, they are calling.
	//We don't access any information that they do not have access to in making this determination.

	let allTilesHand = new Hand()
	allTilesHand.contents = Wall.getNonPrettyTiles()

	discardPile.forEach((tile) => {
		allTilesHand.removeMatchingTile(tile)
	})

	//We don't check inPlacemat, so should be used for server side use only.
	//Remove the contents of the user's hand from allTilesHand
	this.contents.forEach((item) => {
		if (item instanceof Tile) {allTilesHand.removeMatchingTile(item)}
		else if (item instanceof Sequence) {item.tiles.forEach((tile) => {allTilesHand.removeMatchingTile(tile)})}
		else if (item instanceof Match) {new Array(item.amount).fill().forEach(() => {allTilesHand.removeMatchingTile(item.getComponentTile())})}
	})

	while (allTilesHand.contents.length) {
		let tile = allTilesHand.contents[0]
		while (allTilesHand.removeMatchingTile(tile)) {} //Remove all matching tiles from allTilesHand so that we don't call isMahjong with the same tile several times.

		//isMahjong can be rather slow when called repeatedly. Let's do some quick checking to confirm this tile may actually help.
		//We either need to have an existing copy of the tile, or the ability for this tile to fill a sequence.
		let passes = this.contents.some((item, i) => {
			return tile.matches(item)
		});

		if (!passes && !isNaN(tile.value)) {
			let arr = [,,true,,,]
			this.contents.forEach((item) => {
				if (item.type === tile.type && Math.abs(item.value - tile.value) <= 2) {
					arr[2-(item.value - tile.value)] = true
				}
			})
			if (arr[0] && arr[1] || arr[3] && arr[4]) {passes = true}
		}

		if (!passes) {
			continue;
		}

		this.add(tile)
		if (this.isMahjong(this, unlimitedSequences)) {
			this.remove(tile)
			return true
		}
		this.remove(tile)
	}
	return false
}

module.exports = isCalling
