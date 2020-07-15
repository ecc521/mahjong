const Match = require("../Match.js")
const Tile = require("../Tile.js")

function score(config = {}) {
	let doubles = 0
	let score = 0
	let sequences = false

	let oldContents = this.contents.slice(0)

	for (let i=0;i<this.contents.length;i++) {
		let match = this.contents[i]

		//If we have empty tiles laying around, let's try and create the largest matches possible, as we clearly aren't mahjong.
		if (match instanceof Tile) {
			[4,3,2].forEach(((amount) => {
				if (!(match instanceof Tile)) {return} //Already matched.
				if (this.removeMatchingTilesFromHand(match, amount)) {
					i-- //Counteract position shifting. 
					match = new Match({amount, type: match.type, value: match.value, exposed: false})
				}
			}).bind(this))
		}

		doubles += match.isDouble(this.wind)
		score += match.getPoints(this.wind)
		sequences = sequences || match.isSequence
	}

	if (config.isMahjong) {
		score += 20
		if (config.drewOwnTile) {
			score += 10
		}
		if (!sequences) {
			score += 10
		}
	}

	this.contents = oldContents //Reset any modifications

	doubles += this.getClearHandDoubles()

	return score * (2**doubles)
}

module.exports = score
