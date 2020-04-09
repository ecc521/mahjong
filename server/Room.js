class Room {
	constructor(roomId) {
		this.roomId = roomId

		this.clientIds = []
		this.inGame = false
		this.roomCreated = Date.now()
		this.gameData = {}

		let sendClientList = (function sendClientList() {
			console.log("sending client list")
			let clientList = []
			this.clientIds.forEach((clientId) => {
				clientList.push({
					id: clientId,
					nickname: global.stateManager.getClient(clientId).getNickname(),
					isHost: (clientId === this.hostClientId)
				})
			})
			console.log(this.clientIds.length)
			console.log(clientList.length)
			this.messageAll("clientList", clientList)
		}).bind(this)

		this.addClient = (function(clientId) {
			if (this.clientIds.length >= 4) {
				return "Room Full"
			}
			if (this.clientIds.includes(clientId)) {return "Already In Room"}
			if (!this.hostClientId) {this.hostClientId = clientId}
			this.clientIds.push(clientId)
			sendClientList()
			return true
		}).bind(this)

		this.removeClient = (function(clientId) {
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
				sendClientList()
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

		this.close = (function(reason) {
			this.clientIds.forEach((clientId) => {
				let client = global.stateManager.getClient(clientId)
				client.close()
			})
			global.stateManager.deleteRoom(roomId)
		}).bind(this)

		this.incomingMessage = (function(clientId, obj) {
			console.log("Received message")
			console.log(clientId)
			console.log(JSON.stringify(obj))

			let client = global.stateManager.getClient(clientId)
			let isHost = (clientId === this.hostClientId)

			if (obj.type === "roomActionLeaveRoom") {
				this.removeClient(clientId)
				return client.message(obj.type, "Left Room", "success")
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
				//The host can only click if the game has not started.
				this.removeClient(clientId)
				return client.message(obj.type, "Kicked Client", "success")
			}
			else if (obj.type === "roomActionStartGame") {
				if (!isHost) {
					return client.message(obj.type, "Only Host Can Start", "error")
				}
				if (this.inGame) {
					return client.message(obj.type, "Already In Game", "error")
				}


			}
			else if (obj.type === "roomActionEndGame") {
				//If the game is started, anybody can end the game. Otherwise, only the host can.
				if (!this.inGame) {
					return client.message(obj.type, "No Game In Progress", "error")
				}


			}
			else if (obj.type === "roomActionCloseRoom") {
				if (!isHost) {
					return client.message(obj.type, "Only Host Can Close Room", "error")
				}
			}
		}).bind(this)
	}
}


module.exports = Room
