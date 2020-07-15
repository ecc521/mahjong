function score(config = {}) {
	let doubles = 0
	let score = 0
	let sequences = false

	let oldContents = this.contents.slice(0)

	for (let i=0;i<this.contents.length;i++) {
		let match = this.contents[i]

		//If we have empty tiles laying around, let's try and create the largest matches possible, as we clearly aren't mahjong.
		//This may well cause position shifting after this tile in the array, but that shouldn't be a problem.
		if (match instanceof Tile) {
			[4,3,2].forEach(((amount) => {
				if (!(match instanceof Tile)) {return} //Already matched.
				if (this.removeMatchingTilesFromHand(match, amount)) {
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

	doubles += this.getClearHandDoubles()

	this.contents = oldContents //Reset any modifications

	return score * (2**doubles)
}

module.exports = score
