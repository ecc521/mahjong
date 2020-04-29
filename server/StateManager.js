const Room = require("./Room.js")
const Client = require("./Client.js")

class StateManager {
	constructor(rooms = {}, clients = {}) {

		//We'll trim all leading and trailing spaces for roomIds.
		rooms = new Proxy(rooms, {
			get: function(obj, prop) {
				//Since values are trimmed when added, this is unless we loaded from a saved state.
				let value = obj[prop]
				if (value instanceof String) {
					return value.trim()
				}
				return value
			},
			set: function(obj, prop, value) {
				if (value instanceof String) {
					value = value.trim()
				}
				obj[prop] = value
				return true
			}
		})

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

		this.toJSON = (function() {
			//Convert our state to a string.
			//Since both room and client objects have a toString method, we can do this quite easily with JSON.stringify
			return JSON.stringify({
				rooms,
				clients
			})
		}).bind(this)
	}

	static fromJSON(str) {
		//Create stateManager from a saved state.

		let obj = JSON.parse(str)
		let rooms = obj.rooms
		let clients = obj.clients

		for (let roomId in rooms) {
			rooms[roomId] = Room.fromJSON(rooms[roomId])
		}

		for (let clientId in clients) {
			clients[clientId] = Client.fromJSON(clients[clientId])
		}

		return new StateManager(rooms, clients)
	}
}

module.exports = StateManager
