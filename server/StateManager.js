const Room = require("./Room.js")
const Client = require("./Client.js")
const Bot = require("./Bot.js")

//For state saving.
const fs = require("fs")
const path = require("path")

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

		this.createRoom = function(roomId, room = new Room(roomId)) {
			if (rooms[roomId]) {return false} //Room already exists.
			return rooms[roomId] = room
		}

		this.writeRoomState = (function(roomId) {
			if (!this.serverDataDirectory) {console.warn("No server data directory. ")}
			let room = rooms[roomId]
			try {
				//Write state to disk.
				let filePath = path.join(this.serverDataDirectory, room.saveId + ".room.json")
				console.log("Saved room to " + filePath)
				fs.writeFileSync(filePath, JSON.stringify(room))
			}
			catch(e) {console.error(e)}
		}).bind(this)

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

		this.createBot = function(clientId) {
			clients[clientId] = new Bot(clientId)
			return clients[clientId]
		}

		this.deleteClient = function(clientId) {
			delete clients[clientId]
		}

		this.init = (function fromJSON(str) {
			//Load clients and rooms from a saved state.
			console.time("Initializing server state... ")
			let obj = JSON.parse(str)
			let loadClients = obj.clients
			let loadRooms = obj.rooms

			for (let clientId in loadClients) {
				clients[clientId] = Client.fromJSON(loadClients[clientId])
			}

			for (let roomId in loadRooms) {
				rooms[roomId] = Room.fromJSON(loadRooms[roomId])
				rooms[roomId].init()
				console.log(global.stateManager.getRoom(roomId))
			}
			console.timeEnd("Initializing server state... ")
		}).bind(this)

		this.toJSON = (function() {
			//Convert our state to a string.
			//Since both room and client objects have a toString method, we can do this quite easily with JSON.stringify
			return JSON.stringify({
				rooms,
				clients
			})
		}).bind(this)
	}
}

module.exports = StateManager
