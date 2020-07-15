function startGame(obj) {
	if (this.clientIds.length !== 4) {return "Not Enough Clients"}
	else {
		this.inGame = true
		this.messageAll([], obj.type, "Game Started", "success")
		//Build the wall.
		this.gameData.wall = new Wall()
		this.gameData.discardPile = []
		this.gameData.settings = {}
		this.gameData.settings.unlimitedSequences = false
		this.gameData.settings.charleston = ["right", "across", "left"] //Note that charleston is not mandatory. East wind gets the choice.

		this.gameData.playerHands = {}

		//Build the player hands.
		//For now, we will randomly assign winds.
		let winds = ["north", "east", "south", "west"]
		let eastWindPlayerId;

		if (this.clientIds.includes(this.gameData.eastWindPlayerId)) {
			winds.splice(winds.indexOf("east"), 1) //Delete east wind option
		}

		for (let i=0;i<this.clientIds.length;i++) {
			let clientId = this.clientIds[i]

			let wind;
			if (this.gameData.eastWindPlayerId === clientId) {
				wind = "east"
				delete this.gameData.eastWindPlayerId
			}
			else {
				wind = winds.splice(Math.floor(Math.random() * winds.length), 1)[0]
			}
			let hand = new Hand({wind})
			this.gameData.playerHands[clientId] = hand

			let tileCount = 13
			if (wind === "east") {
				eastWindPlayerId = clientId
				tileCount = 14
			}
			for (let i=0;i<tileCount;i++) {
				drawTile(clientId, false, true)
			}
		}

		this.gameData.currentTurn = {
			thrown: false,
			userTurn: eastWindPlayerId
		}

		this.gameData.currentTurn.turnChoices = new Proxy({}, turnChoicesProxyHandler);
		sendStateToClients()
	}
}

module.exports = startGame
