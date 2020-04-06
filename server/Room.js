class Room {
	constructor(roomId) {
		this.roomId = roomId
		rooms[roomId] = this

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
			this.messageAll(reason)
			this.clients.forEach((client) => {client.end("Room Closed")})
			delete rooms[roomId]
		}).bind(this)
	}
}
