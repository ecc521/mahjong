function scoreHand(hand, config) {
	//Hand is an array of arrays of Tiles, Matches, and Prettys

	let doubles = 0
	let score = 0

	for (let i=0;i<hand.length;i++) {
		let match = hand[i]
		doubles += match.isDouble(config.userWind)
		points += match.getPoints(config.userWind)
	}

	if (isMahjong(hand, config.unlimitedSequences)) {
		score += 20
		if (config.drewOwnTile) {
			score += 10
		}
		if (sequences === 0) {
			score += 10
		}
	}

	return score * (2**doubles)
}



function isMahjong(hand, unlimitedSequences) {
	let pongOrKong = 0
	let pairs = 0
	let sequences = 0

	for (let i=0;i<hand.length;i++) {
		let match = hand[i]
		pongOrKong += match.isPongOrKong
		pairs += match.isPair
		sequences += match.isSequence
	}

	if (pairs === 1) {
		if (unlimitedSequences) {
			if (sequences + pongOrKong === 4) {return true}
		}
		else {
			if (Math.max(sequences, 1) + pongOrKong === 4) {return true}
		}
	}

	return false
}


module.exports = {
	scoreHand,
	isMahjong
}
