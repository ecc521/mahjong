function score(config = {}) {
	let doubles = 0
	let score = 0
	let sequences = false

	for (let i=0;i<this.contents.length;i++) {
		let match = this.contents[i]
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

	return score * (2**doubles)
}

module.exports = score
