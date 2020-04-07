const Room = require("./Room.js")
const Client = require("./Client.js")

class StateManager {
	constructor() {
		let rooms = {}
		let clients = {}

		this.getRoom = function(roomId) {
			return rooms[roomId]
		}

		this.createRoom = function(roomId) {
			if (rooms[roomId]) {return false} //Room already exists.
			rooms[roomId] = new Room(roomId)
			return rooms[roomId]
		}

		this.deleteRoom = function(roomId) {
			delete rooms[roomId]
		}

		this.getClient = function(clientId) {
			return clients[clientId]
		}

		this.createClient = function(clientId, websocket) {
			clients[clientId] = new Client(clientId, websocket)
			return clients[clientId]
		}

		this.deleteClient = function(clientId) {
			delete clients[clientId]
		}
	}
}

module.exports = StateManager
