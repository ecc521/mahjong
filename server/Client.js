class Client {
	constructor(clientId, websocket) {
		this.clientId = clientId
		this.websocket = websocket

		this.setWebsocket = function(websocket) {
			this.websocket = websocket
		}

		this.message = (function(type, message, status) {
			return JSON.stringify({
				type, message, status
			})
		}).bind(this)

		this.delete = (function(message) {
			websocket.close(1000) //Status code: Normal close.
			global.stateManager.deleteClient(clientId)
		}).bind(this)
	}
}
