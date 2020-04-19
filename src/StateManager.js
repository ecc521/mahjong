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
					setTimeout((function() {
						//2 second delay on reconnects. Don't want to send out 100s of requests per second when something goes wrong.
						this.createWebsocket()
						this.syncState()
					}).bind(this), 2000)
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
			console.log(message.data)
			let obj = JSON.parse(message.data)
			console.log(obj)
			if (obj.type === "joinRoom") {
				onJoinRoom(obj)
			}
			else if (obj.type === "createRoom") {
				onCreateRoom(obj)
			}
			else if (obj.type === "roomActionState") {
				onStateUpdate(obj)
			}
			else if (obj.type === "roomActionKickFromRoom") {
				//We kicked somebody else. Should probably show an error message or success.
			}
			else if (obj.type === "roomActionLeaveRoom") {
				onLeaveRoom(obj)
			}
			else if (obj.type === "getCurrentRoom") {
				onGetCurrentRoom(obj)
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

		this.closeRoom = function(roomId) {
			this.sendMessage(JSON.stringify({
				type: "roomActionCloseRoom",
				clientId: window.clientId,
				roomId,
			}))
		}

		this.getCurrentRoom = (function() {
			//Get our room.
			this.sendMessage(JSON.stringify({
				"type": "getCurrentRoom",
				clientId: window.clientId
			}))
		}).bind(this)

		this.getState = function(roomId) {
			console.log("Getting state...")
			this.sendMessage(JSON.stringify({
				type: "roomActionState",
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


		let onStateUpdate = (function onStateUpdate(obj) {
			this.isHost = obj.message.isHost
			if (this.onStateUpdate instanceof Function) {this.onStateUpdate(obj)}
		}).bind(this)

		let onGetCurrentRoom = (function onGetCurrentRoom(obj) {
			this.inRoom = obj.message || false
			//Now, if we are in a room, we should sync state with the room.
			if (this.inRoom) {
				onJoinRoom(obj)
				this.getState(this.inRoom)
			}
		}).bind(this)
	}

	static setClientId(newId) {
		window.clientId = newId
		localStorage.setItem("clientId", window.clientId)
	}

	static createNewClientId() {
		return "user" + (Math.random() * 2**53)
	}

	static getClientId() {
		//Get the users clientId, or create a new one.
		let clientId = localStorage.getItem("clientId")
		if (clientId === null) {
			clientId = StateManager.createNewClientId()
		}
		return clientId
	}
}

StateManager.setClientId(StateManager.getClientId())

module.exports = StateManager
