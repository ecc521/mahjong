class Room {
	constructor(roomId, state = {}, moves = []) {
		this.roomId = roomId
		this.state = state
		this.moves = moves

		//state contains all room configuration.
		//moves contains all in-game actions.

		this.clients = []

		this.onIncomingMessage = function(client, obj) {
			//Process the incoming message.
			console.log(client)
			console.log(JSON.stringify(obj))

		}


		this.toJSON = (function() {
			return [this.state, this.moves]
		}).bind(this)
	}

	static fromJSON(obj, keepGameStarted = false) {
		return new Room(obj.roomId, obj[0], obj[1])
	}
}

module.exports = Room
