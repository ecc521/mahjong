let Bot; //Don't want both scripts importing each other.

class Client {
	constructor(clientId) {
		this.nickname = this.clientId = clientId

		this.websockets = []

		//TODO: We need to remove these websockets when they close
		//Also handle when they become unresponsive - ping/pong setup.
		this.addWebsocket = (function(websocket) {
			this.websockets.push(websocket)
		}).bind(this)

		this.setNickname = (function(nickname) {
			//Leave their name as their client id if they don't pick a real one!
			if (nickname.trim()) {
				this.nickname = nickname.slice(0, 14) //14 character limit on nicknames.
			}
		}).bind(this)

		this.getNickname = function() {return this.nickname}

		this.suppressed = false
		this.suppress = function() {this.suppressed = true}
		this.unsuppress = function() {this.suppressed = false}

		this.message = (function message(type, message, status) {
			if (this.suppressed) {return}

			for (let index in this.websockets) {
				let websocket = this.websockets[index]

				try {
					//Handle errors where the websocket connection has closed.
					//We can probably do this simply by not sending the message, as the client should sync state if they disconnected.
					return this.websocket.send(JSON.stringify({
						type, message, status
					}))
				}
				catch (e) {
					console.error(e)
				}
			}
		}).bind(this)


		this.delete = (function(message) {
			for (let index in this.websockets) {
					let websocket = this.websockets[index]
					try {
						websocket.close(1000) //Status code: Normal close.
					}
					catch(e) {}
			}
			global.stateManager.deleteClient(clientId)
		}).bind(this)

		//this.roomId should be cleared when this client is removed from a room. Probably moot due to getRoomId checks though.
		this.setRoomId = function(roomId) {
			this.roomId = roomId
		}

		this.getRoomId = function() {
			//Validate that the client is actually in the room...
			let room = global.stateManager.getRoom(this.roomId)
			if (room && room.clientIds.includes(this.clientId)) {
				return this.roomId
			}
		}

		this.getRoom = function() {
			return global.stateManager.getRoom(this.getRoomId())
		}

		this.toJSON = (function() {
			let obj = {
				clientId: this.clientId,
				nickname: this.nickname,
				roomId: this.roomId,
				isBot: this.isBot
			}
			console.log("Called")
			console.log(JSON.stringify(obj))
			return JSON.stringify(obj)
		}).bind(this)
	}

	static fromJSON(str) {
		//Create client from a string.

		let obj = JSON.parse(str)
		let client;
		if (obj.isBot) {
			if (!Bot) {Bot = require("./Bot.js")}
			client = new Bot(obj.clientId)
		}
		else {
			client = new Client(obj.clientId)
		}
		client.setNickname(obj.nickname)

		client.setRoomId(obj.roomId)

		return client
	}
}

module.exports = Client
