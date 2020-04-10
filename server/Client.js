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
	}
}

module.exports = Client
