function evaluateNextMove() {
	let room = this.getRoom()

	if (room.inGame === false) {return} //Nothing for us to do not in a game.

	let gameData = room.gameData
	let currentHand = gameData.playerHands[this.clientId]

	if (gameData.currentTurn.turnChoices[this.clientId]) {return}; //We are ready for this turn.


	//Call room.onPlace properly.
	let placeTiles = (function placeTiles(tiles, goMahjong = currentHand.isMahjong()) {
		if (!(tiles instanceof Array)) {tiles = [tiles]}
		room.onPlace({
			mahjong: goMahjong,
			type: "roomActionPlaceTiles",
			message: tiles = tiles.map((tile) => {return tile.toJSON()})
		}, this.clientId)
	}).bind(this)




	if (gameData.charleston) {
		//We need to choose 3 tiles.


		//TESTING: Be stupid
		placeTiles(currentHand.contents.slice(-3))
	}
	else if (gameData.currentTurn.userTurn === this.clientId) {
		//We need to choose a discard tile.

		//TESTING: Be stupid.
		placeTiles(currentHand.contents[Math.floor(Math.random() * currentHand.contents.length)])
	}
	else if (gameData.currentTurn.thrown) {
		//We need to evaluate if we pick up the thrown tile.

		//TESTING: NEVER!!!
		room.onNext({}, this.clientId)
	}
}

module.exports = evaluateNextMove
