class Room {
	constructor(roomId) {
		this.roomId = roomId

		this.clientIds = []
		this.inGame = false
		this.roomCreated = Date.now()
		this.gameData = {}

		let getState = (function getState(clientId) {
			//Generate the game state visible to clientId
			let state = {}
			state.isHost = (clientId === this.hostClientId);

			state.clients = []
			this.clientIds.forEach((clientId) => {
				state.clients.push({
					id: clientId,
					nickname: global.stateManager.getClient(clientId).getNickname(),
					isHost: (clientId === this.hostClientId)
					//Add visibleHand and wind.
				})
			})

			return state
		}).bind(this)

		let sendStateToClients = (function sendStateToClients() {
			this.clientIds.forEach((clientId) => {
				let client = global.stateManager.getClient(clientId)
				let state = getState(clientId)
				client.message("roomActionState", state, "success")
			})
		}).bind(this)

		this.addClient = (function(clientId) {
			if (this.clientIds.length >= 4) {
				return "Room Full"
			}
			if (this.clientIds.includes(clientId)) {return "Already In Room"}
			if (!this.hostClientId) {this.hostClientId = clientId}
			this.clientIds.push(clientId)
			sendStateToClients()
			return true
		}).bind(this)

		this.removeClient = (function(clientId, explaination = "You have left the room. ") {
			let clientIdIndex = this.clientIds.findIndex((currentClientId) => {return currentClientId === clientId})
			if (clientIdIndex === -1) {
				return "Client Not Found"
			}
			else {
				this.clientIds.splice(clientIdIndex, 1)
				if (this.hostClientId === clientId) {
					//Choose a new host client.
					this.hostClientId = this.clientIds[0]
				}
				sendStateToClients()

				let clientBeingKicked = global.stateManager.getClient(clientId)
				if (clientBeingKicked) {
					clientBeingKicked.message("roomActionLeaveRoom", explaination, "success")
					//The client is going to change their client Id. We can now delete the old client.
					global.stateManager.deleteClient(clientId)
				}
			}
		}).bind(this)

		this.startGame = (function() {
			if (this.clientIds.length !== 4) {return "Not Enough Clients"}
			else {
				this.inGame = true
			}
		}).bind(this)

		this.messageAll = (function(...args) {
			console.log(this.clientIds.length)
			this.clientIds.forEach((clientId) => {
				console.log("Messaging client " + clientId)
				let client = global.stateManager.getClient(clientId)
				client.message(...args)
			})
		}).bind(this)

		this.startGame = (function startGame() {

		}).bind(this)

		this.onIncomingMessage = (function(clientId, obj) {
			console.log("Received message")
			console.log(clientId)
			console.log(JSON.stringify(obj))

			let client = global.stateManager.getClient(clientId)
			let isHost = (clientId === this.hostClientId)

			if (obj.type === "roomActionLeaveRoom") {
				return this.removeClient(clientId)
			}
			else if (obj.type === "roomActionKickFromRoom") {
				if (!isHost) {
					console.log(client)
					console.log(client.message)
					return client.message(obj.type, "Only Host Can Kick", "error")
				}
				if (this.inGame) {
					return client.message(obj.type, "Can't Kick During Game", "error")
				}
				//The host can only kick if the game has not started.
				//TODO: Inform the other client that they have been kicked so they don't end up out of state.
				this.removeClient(obj.id, "You have been kicked from the room. ") //obj.id is the id of the user to kick.
				return client.message(obj.type, "Kicked Client", "success")
			}
			else if (obj.type === "roomActionStartGame") {
				if (!isHost) {
					return client.message(obj.type, "Only Host Can Start", "error")
				}
				if (this.inGame) {
					return client.message(obj.type, "Already In Game", "error")
				}

				//Time to start the game.
				return this.startGame()
			}
			else if (obj.type === "roomActionEndGame") {
				//If the game is started, anybody can end the game. Otherwise, only the host can.
				if (!this.inGame) {
					return client.message(obj.type, "No Game In Progress", "error")
				}
				//TODO: End the game.
				return

			}
			else if (obj.type === "roomActionCloseRoom") {
				if (!isHost) {
					return client.message(obj.type, "Only Host Can Close Room", "error")
				}
				this.clientIds.slice(0).forEach((clientId) => {
					this.removeClient(clientId, "The room has been closed. ")
				})
				global.stateManager.deleteRoom(this.roomId)
			}
			else if (obj.type === "roomActionState") {
				return client.message(obj.type, getState(clientId), "success")
			}
		}).bind(this)
	}
}


module.exports = Room
