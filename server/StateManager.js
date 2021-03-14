const Room = require("./Room.js")
const Client = require("./Client.js")
const Bot = require("./Bot.js")

//For state saving.
const fs = require("fs")
const path = require("path")

class StateManager {
	constructor(config = {}) {

		//We'll trim all leading and trailing spaces for roomIds. Room IDs are case aware but case insensitive.
		let rooms = new Proxy(config.rooms || {}, {
			get: function(roomsObj, roomId) {
				return roomsObj[roomId.toLowerCase()][0]
			},
			set: function(roomsObj, roomId, room) {
				roomsObj[roomId.toLowerCase()] = [room, roomId]
				return true
			}
		})

		this.getRoom = function(roomId) {
			return rooms[roomId]
		}

		//Should swap single player rooms to using this. 
		this.createRoomId = function(prefix) {
			return StateManager.findUniqueId(rooms, prefix)
		}

		this.createRoom = function(roomId) {
			if (rooms[roomId]) {return false} //Room already exists.
			return rooms[roomId] = new Room(roomId)
		}

		this.deleteRoom = function(roomId) {
			delete rooms[roomId]
		}

		//Clients can be temporary or permanent.
		//Right now, all are temporary, in that deleting them doesn't cause anything to be lost, provided they aren't in a game at the moment.

		let clients = config.clients || {}

		this.getClient = function(clientId) {
			return clients[clientId]
		}

		this.createClient = function() {
			let clientId = StateManager.findUniqueId(clients, "user:")
			return clients[clientId] = new Client(clientId)
		}

		this.createBot = function() {
			let clientId = StateManager.findUniqueId(clients, "bot:")
			return clients[clientId] = new Bot(clientId)
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

	static findUniqueId(obj, prefix = "") {
		let random, id;
		let idLimit = 1e4 //We will use short ids until we have trouble generating ids.

		while (!id || obj[prefix + random]) {
			random = Math.floor(Math.random() * idLimit)
			id = prefix + random
			idLimit = Math.min(2**53, idLimit * 2)
		}

		return id
	}
}

module.exports = StateManager
