//Get the users clientId, or create a new one.
window.clientId = localStorage.getItem("clientId")
if (window.clientId === null) {
	window.clientId = "mahjongWithFriendsClient" + (Math.random() * 2**53)
	localStorage.setItem("clientId", window.clientId)
}

class StateManager {
	constructor(websocketURL) {

		this.createWebsocket = (async function createWebsocket() {
			//TODO: Improve reconnection code. We don't want to fail reconnecting 100 times a second.
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
					setTimeout((function() {
						//1 second delay to reduce thrashing
						this.createWebsocket()
						this.syncState()
					}).bind(this), 1000)
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
				console.log(message)
				this.websocket.send(message)
			}
		}).bind(this)
		this.createWebsocket()

		function onmessage(message) {
			console.log(message)
			let obj = JSON.parse(message.data)
			console.log(obj)
			if (obj.type === "joinRoom") {
				onJoinRoom(obj)
			}
			else if (obj.type === "createRoom") {
				onCreateRoom(obj)
			}
			else if (obj.type === "clientList") {
				onClientListChange(obj)
			}
			else if (obj.type === "roomActionKickFromRoom") {
				//We kicked somebody else. Should probably show an error message or success.
			}
			else if (obj.type === "roomActionLeaveRoom") {
				onLeaveRoom(obj)
			}
			else {
				console.log("Unknown Type " + obj.type)
			}
		}

		this.inRoom = false
		this.isHost = false

		this.joinRoom = function(roomId, nickname) {
			this.sendMessage(JSON.stringify({
				type: "joinRoom",
				clientId: window.clientId,
				roomId,
				nickname
			}))
		}

		this.createRoom = function(roomId, nickname) {
			this.sendMessage(JSON.stringify({
				type: "createRoom",
				clientId: window.clientId,
				roomId,
				nickname
			}))
		}

		this.kickUser = function(roomId, userId) {
			this.sendMessage(JSON.stringify({
				type: "roomActionKickFromRoom",
				clientId: window.clientId,
				roomId,
				id: userId ///id of user to kick.
			}))
		}

		this.leaveRoom = function(roomId) {
			this.sendMessage(JSON.stringify({
				type: "roomActionLeaveRoom",
				clientId: window.clientId,
				roomId,
			}))
		}


		let onCreateRoom = (function onCreateRoom(obj) {
			if (obj.status === "success") {
				this.inRoom = obj.message
				this.isHost = true
			}
			if (this.onCreateRoom instanceof Function) {this.onCreateRoom(obj)}
		}).bind(this)

		let onJoinRoom = (function onJoinRoom(obj) {
			if (obj.status === "success") {
				this.inRoom = obj.message
			}
			if (this.onJoinRoom instanceof Function) {this.onJoinRoom(obj)}
		}).bind(this)

		let onLeaveRoom = (function onLeaveRoom(obj) {
			if (obj.status === "success") {
				this.inRoom = false
				this.isHost = false
			}
			if (this.onLeaveRoom instanceof Function) {this.onLeaveRoom(obj)}
		}).bind(this)


		let onClientListChange = (function onClientListChange(obj) {
			console.log("Client List Changed")

			obj.message.forEach((obj) => {
				if (obj.id === window.clientId) {
					this.isHost = obj.isHost
				}
			})

			if (this.onClientListChange instanceof Function) {this.onClientListChange(obj)}
		}).bind(this)

		function onStateReceived() {

		}

		this.syncState = (function() {
			//Sync everything with the server.
			/*this.sendMessage(JSON.stringify({
				"type": "gameStateRequest",
				clientId: window.clientId
			}))*/
		}).bind(this)
	}
}

module.exports = StateManager
