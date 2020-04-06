class Client {
	constructor(clientId, websocket) {
		this.clientId = clientId
		this.websocket = websocket
		clients[clientId] = this

		this.message = (function(message, type = "message") {
			this.websocket.send(JSON.stringify({
				type, message
			}))
		}).bind(this)

		this.end = (function(message) {
			this.message(message, "terminate")
			delete clients[clientId]
		}).bind(this)
	}
}
