const Wall = require("../../src/Wall.js")
const Hand = require("../../src/Hand.js")
const fs = require("fs")
const path = require("path")

function startGame(obj) {
	if (this.clientIds.length !== 4) {return "Not Enough Clients"}
	else {
		let saveId = this.roomId + Date.now() //New save key for every game started.
		this.outputFile = fs.createWriteStream(path.join(global.stateManager.serverDataDirectory, saveId))

		this.inGame = true
		this.messageAll([], obj.type, "Game Started", "success")

		//Build the wall.
		this.gameData.wall = new Wall(this.state.seed)

		this.state.hostClientId = this.hostClientId
		this.moves = []

		this.gameData.discardPile = []

		//Assign new settings
		if (obj?.settings?.unlimitedSequences !== undefined) {
			this.state.settings.unlimitedSequences = obj?.settings?.unlimitedSequences
		}

		if (obj?.settings?.botSettings?.canCharleston !== undefined) {
			this.state.settings.botSettings.canCharleston = obj?.settings?.botSettings?.canCharleston
		}


		this.gameData.playerHands = {}

		//Build the player hands.
		//For now, we will randomly assign winds.

		//windAssignments is clientId: wind
		let winds = ["north", "east", "south", "west"]
		let windAssignments = {}

		for (let clientId in this.state.settings.windAssignments) {
			let wind = this.state.settings.windAssignments[clientId]

			if (obj?.settings?.randomizeWinds && wind !== "east") {continue}

			if (this.clientIds.includes(clientId)) {
				let windIndex = winds.indexOf(wind)
				//If two clientIds have the same wind, we need to exclude one.
				if (windIndex !== -1) {
					winds.splice(windIndex, 1)
					windAssignments[clientId] = wind
				}
			}
		}

		this.clientIds.forEach((clientId) => {
			if (!windAssignments[clientId]) {
				windAssignments[clientId] = winds.splice(Math.floor(Math.random() * winds.length), 1)[0]
			}
		})

		console.log(windAssignments)

		let eastWindPlayerId;
		for (let clientId in windAssignments) {
			console.log(clientId)
			let wind = windAssignments[clientId]

			let hand = new Hand({wind})
			this.gameData.playerHands[clientId] = hand

			let tileCount = 13
			if (wind === "east") {
				eastWindPlayerId = clientId
				tileCount = 14
			}
			for (let i=0;i<tileCount;i++) {
				this.drawTile(clientId, false, true)
			}
		}

		this.state.settings.windAssignments = windAssignments
		console.log(this.state.settings.windAssignments)

		this.outputFile.write(JSON.stringify(this.state) + "\n")

		this.gameData.currentTurn = {
			thrown: false,
			userTurn: eastWindPlayerId
		}

		this.gameData.currentTurn.turnChoices = new Proxy({}, this.turnChoicesProxyHandler);
		this.sendStateToClients()
	}
}

module.exports = startGame
