//Get the users clientId, or create a new one.
let clientId = localStorage.getItem("clientId")
if (clientId === null) {
	clientId = "mahjongWithFriendsClient" + (Math.random() * 2**53)
	localStorage.setItem("clientId", clientId)
}

class StateManager {
	constructor(websocketURL) {

		this.createWebsocket = (async function createWebsocket() {
			this.websocket = new WebSocket(websocketURL)
			this.websocket.onmessage = onmessage
			this.websocket.onerror = (async function(e) {
				console.error(e)
				this.createWebsocket()
				this.syncState()
			}).bind(this)

			this.websocket.onclose = (async function(e) {
				console.warn(e)
				if (e.code !== 1000) {
					//If not a normal closure, reestablish and sync.
					this.createWebsocket()
					this.syncState()
				}
			}).bind(this)

			this.sendMessage = async function(message) {
				//Send message once socket opens. 
				if (this.websocket.readyState === 0) {
					await new Promise((resolve, reject) => {
						this.websocket.onopen = resolve
						this.websocket.onerror = reject //TODO: Handle error.
					})
				}
				this.websocket.send(message)
			}
		}).bind(this)
		this.createWebsocket()

		function onmessage(message) {
			let obj = JSON.parse(message.data)
			console.log(obj)
			if (obj.type === "gameState") {
				this.onStateReceived(obj)
			}
			else if (obj.type === "tileThrown") {

			}
		}

		this.inRoom = false
		this.isHost = false

		this.joinRoom = function(roomId) {
			this.sendMessage(JSON.stringify({
				"type": "joinRoom",
				clientId,
				roomId
			}))
		}

		this.createRoom = function(roomId) {
			this.sendMessage(JSON.stringify({
				"type": "createRoom",
				clientId,
				roomId
			}))
		}


		function onRoomCreated() {

		}

		function onRoomJoined() {

		}

		function onStateReceived() {

		}

		this.syncState = (function() {
			//Sync everything with the server.
			this.sendMessage(JSON.stringify({
				"type": "gameStateRequest",
				clientId
			}))
		}).bind(this)
	}
}

module.exports = StateManager
