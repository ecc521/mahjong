class Client {
	constructor(clientId, websocket) {
		this.clientId = clientId
		this.nickname = clientId
		this.websocket = websocket

		this.setWebsocket = (function(websocket) {
			this.websocket = websocket
		}).bind(this)

		this.setNickname = (function(nickname) {
			//Leave their name as their client id if they don't pick a real one!
			if (nickname.trim()) {
				this.nickname = nickname
			}
		}).bind(this)

		this.getNickname = function() {return this.nickname}

		this.message = (function message(type, message, status) {
			if (!this.websocket) {console.error("Error in Client.message - Client.websocket is undefined")} //This should only happen if we loaded from state, as we would for testing.
			//TODO: Handle errors where the websocket connection has closed.
			//We can probably do this simply by not sending the message, as the client should sync state if they disconnected.
			return this.websocket.send(JSON.stringify({
				type, message, status
			}))
		}).bind(this)


		this.delete = (function(message) {
			websocket.close(1000) //Status code: Normal close.
			global.stateManager.deleteClient(clientId)
		}).bind(this)

		//TODO: roomId should be removed once this client is removed from a room.
		this.setRoomId = function(roomId) {
			this.roomId = roomId
		}

		this.getRoomId = function() {
			return this.roomId
		}

		this.getRoom = function() {
			return global.stateManager.getRoom(this.roomId)
		}

		this.toString = (function() {
			let obj = {
				clientId: this.clientId,
				nickname: this.nickname
			}
			return obj
		}).bind(this)
	}

	static fromString(str) {
		//Create client from a string.

		let obj = JSON.parse(str)
		let client = new Client(obj.clientId)
		client.setNickname(obj.nickname)
		return client
	}
}

module.exports = Client
