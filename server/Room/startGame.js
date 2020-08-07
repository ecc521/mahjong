const Wall = require("../../src/Wall.js")
const Hand = require("../../src/Hand.js")

function startGame(obj) {
	if (this.clientIds.length !== 4) {return "Not Enough Clients"}
	else {
		this.inGame = true
		this.messageAll([], obj.type, "Game Started", "success")
		//Build the wall.
		if (this.state.wall) {
			this.gameData.wall = Wall.fromJSON(this.state.wall)
		}
		else {
			this.gameData.wall = new Wall()
		}

		this.state.wall = this.gameData.wall.toJSON()

		this.state.hostClientId = this.hostClientId
		this.state.moves.length = 0 //Delete elements, without overwriting proxy.

		this.gameData.discardPile = []
		this.gameData.settings = obj.settings
		this.state.settings = obj.settings

		this.gameData.playerHands = {}

		//Build the player hands.
		//For now, we will randomly assign winds.
		let winds = ["north", "east", "south", "west"]
		let eastWindPlayerId;

		if (this.clientIds.includes(this.gameData.eastWindPlayerId)) {
			winds.splice(winds.indexOf("east"), 1) //Delete east wind option
		}

		let windAssignments = {}

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

			//Overrule wind assignment from state.
			if (this.state.windAssignments) {
				wind = this.state.windAssignments[clientId]
			}

			let hand = new Hand({wind})
			this.gameData.playerHands[clientId] = hand

			windAssignments[clientId] = wind

			let tileCount = 13
			if (wind === "east") {
				eastWindPlayerId = clientId
				tileCount = 14
			}
			for (let i=0;i<tileCount;i++) {
				this.drawTile(clientId, false, true)
			}
		}

		this.state.windAssignments = windAssignments

		this.gameData.currentTurn = {
			thrown: false,
			userTurn: eastWindPlayerId
		}

		this.gameData.currentTurn.turnChoices = new Proxy({}, this.turnChoicesProxyHandler);
		this.sendStateToClients()
	}
}

module.exports = startGame
