class Room {
	constructor(roomId, hostClientId) {
		this.roomId = roomId
		this.hostClientId = hostClientId

		this.clients = []
		this.inGame = false
		this.roomCreated = Date.now()
		this.gameData = {}

		this.addClient = (function(client) {
			if (this.clients.length >= 4) {
				return "Room Full"
			}
			this.clients.push(client)
			this.messageAll(JSON.stringify({
				type: "clientList",
				//
			}))
		}).bind(this)

		this.removeClient = (function(client) {
			let clientIndex = this.clients.findIndex((currentClient) => {return currentClient === client})
			if (clientIndex === -1) {
				return "Client Not Found"
			}
			else {
				this.clients.splice(clientIndex, 1)
				this.messageAll(JSON.stringify({
					type: "clientList",
					//
				}))
			}
		}).bind(this)

		this.startGame = (function() {
			if (this.clients.length !== 4) {return "Not Enough Clients"}
			else {
				this.inGame = true
			}
		}).bind(this)

		this.messageAll = (function(message) {
			this.clients.forEach((client) => {
				client.message(message)
			})
		}).bind(this)

		this.close = (function(reason) {
			this.clients.forEach((client) => {client.close()})
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
					return client.message(obj.type, "Only Host Can Kick", "error")
				}
				this.removeClient(clientId)
				return client.message(obj.type, "Kicked Client", "success")
			}
			else if (obj.type === "roomActionStartGame") {
				if (!isHost) {
					return client.message(obj.type, "Only Host Can Start", "error")
				}



			}
			else if (obj.type === "roomActionEndGame") {
				//If the game is started, anybody can end the game. Otherwise, only the host can.


				
			}
		}).bind(this)
	}
}
