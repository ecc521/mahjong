const Wall = require("../src/Wall.js")
const Hand = require("../src/Hand.js")
const Tile = require("../src/Tile.js")

class Room {
	constructor(roomId, options = {}) {
		this.roomId = roomId

		//TODO: Currently, clientId of other users is shown to users in the same room, allowing for impersonation. This needs to be fixed by using different identifiers.

		this.clientIds = options.clientIds || []
		this.inGame = options.inGame || false
		this.roomCreated = options.roomCreated || Date.now()
		this.gameData = options.gameData || {}
		this.hostClientId = options.hostClientId

		//If these are passed, they will be in a stringified form. Convert them back to normal.
		if (this.gameData.wall) {
			this.gameData.wall = Wall.fromString(this.gameData.wall)
		}

		if (this.gameData.playerHands) {
			for (let clientId in this.gameData.playerHands) {
				this.gameData.playerHands[clientId] = Hand.fromJSON(this.gameData.playerHands[clientId])
			}
		}
		else {this.gameData.playerHands = {}}


		let getState = (function getState(requestingClientId) {
			//Generate the game state visible to requestingClientId
			let state = {}
			state.inGame = this.inGame
			state.isHost = (requestingClientId === this.hostClientId);
			if (this.gameData.wall) {
				state.wallTiles = this.gameData.wall.tiles.length
			}

			state.clients = []
			this.clientIds.forEach((currentClientId) => {
				let visibleClientState = {
					id: currentClientId,
					nickname: global.stateManager.getClient(currentClientId).getNickname(),
					isHost: (currentClientId === this.hostClientId)
				}
				if (this.inGame) {
					if (requestingClientId === currentClientId) {
						//One can see all of their own tiles.
						visibleClientState.hand = this.gameData.playerHands[currentClientId]
					}
					else {
						//One can only see exposed tiles of other players. True says to include other tiles as face down.
						visibleClientState.visibleHand = this.gameData.playerHands[currentClientId].getExposedTiles(true)
						visibleClientState.wind = this.gameData.playerHands[currentClientId].wind
					}
				}
				state.clients.push(visibleClientState)
			})

			return state
		}).bind(this)

		let sendStateToClients = (function sendStateToClients() {
			this.clientIds.forEach((clientId) => {
				let client = global.stateManager.getClient(clientId)
				let state = getState(clientId)
				client.message("roomActionState", state, "success")
			})
		}).bind(this)

		this.addClient = (function(clientId) {
			if (this.clientIds.length >= 4) {
				return "Room Full"
			}
			if (this.clientIds.includes(clientId)) {return "Already In Room"}
			if (!this.hostClientId) {this.hostClientId = clientId}
			this.clientIds.push(clientId)
			sendStateToClients()
			return true
		}).bind(this)

		this.removeClient = (function(clientId, explaination = "You have left the room. ") {
			let clientIdIndex = this.clientIds.findIndex((currentClientId) => {return currentClientId === clientId})
			if (clientIdIndex === -1) {
				return "Client Not Found"
			}
			else {
				this.clientIds.splice(clientIdIndex, 1)
				if (this.hostClientId === clientId) {
					//Choose a new host client.
					this.hostClientId = this.clientIds[0]
				}
				sendStateToClients()

				let clientBeingKicked = global.stateManager.getClient(clientId)
				if (clientBeingKicked) {
					clientBeingKicked.message("roomActionLeaveRoom", explaination, "success")
					//The client is going to change their client Id. We can now delete the old client.
					global.stateManager.deleteClient(clientId)
				}
				if (this.clientIds.length === 0) {
					//We have no clients. Delete this room.
					//Note that this code shouldn't be called, unless there is a bug or lag. The client will not show the Leave Room button if they are the
					//only player and host (which they should be if they are the only player), and therefore roomActionCloseRoom will be sent instead.
					global.stateManager.deleteRoom(this.roomId)
				}
			}
		}).bind(this)

		this.messageAll = (function(...args) {
			console.log(this.clientIds.length)
			this.clientIds.forEach((clientId) => {
				console.log("Messaging client " + clientId)
				let client = global.stateManager.getClient(clientId)
				client.message(...args)
			})
		}).bind(this)

		this.startGame = (function(messageKey) {
			if (this.clientIds.length !== 4) {return "Not Enough Clients"}
			else {
				this.inGame = true
				this.messageAll(messageKey, "Game Started", "success")
				//Build the wall.
				this.gameData.wall = new Wall()

				//Build the player hands.
				let drawTile = (function drawTile(clientId, last = false) {
					let tile;
					while (!(tile instanceof Tile)) {
						if (last) {
							tile = this.gameData.wall.drawLast()
						}
						else {
							tile = this.gameData.wall.drawFirst()
						}
						if (!tile) {console.log("Wall Empty");return} //TODO: Game over. Wall empty.
						this.gameData.playerHands[clientId].add(tile)
					}
				}).bind(this)

				//For now, we will randomly assign winds.
				let winds = ["north", "east", "south", "west"]

				for (let i=0;i<this.clientIds.length;i++) {
					let clientId = this.clientIds[i]

					let wind = winds.splice(Math.floor(Math.random() * winds.length), 1)[0]
					let hand = new Hand({wind})
					this.gameData.playerHands[clientId] = hand

					let tileCount = (wind === "east")?14:13
					for (let i=0;i<tileCount;i++) {
						drawTile(clientId)
					}
				}

				sendStateToClients()
			}
		}).bind(this)

		this.endGame = (function startGame(messageKey, clientId) {
			let gameEndMessage = "The Game Has Ended";
			if (clientId) {
				let client = global.stateManager.getClient(clientId)
				//Tell players who ended the game, so blame can be applied.
				gameEndMessage = "The game has been ended by " + clientId + ", who goes by the name of " + client.getNickname() + "."
			}
			this.gameData = {}
			this.messageAll(messageKey, gameEndMessage, "success")
		}).bind(this)


		this.onIncomingMessage = (function(clientId, obj) {
			console.log("Received message")
			console.log(clientId)
			console.log(JSON.stringify(obj))

			let client = global.stateManager.getClient(clientId)
			let isHost = (clientId === this.hostClientId)

			if (obj.type === "roomActionLeaveRoom") {
				return this.removeClient(clientId)
			}
			else if (obj.type === "roomActionKickFromRoom") {
				//Only the host can kick, and only if the game has not started.
				if (!isHost) {
					console.log(client)
					console.log(client.message)
					return client.message(obj.type, "Only Host Can Kick", "error")
				}
				if (this.inGame) {
					return client.message(obj.type, "Can't Kick During Game", "error")
				}
				this.removeClient(obj.id, "You have been kicked from the room. ") //obj.id is the id of the user to kick.
				return client.message(obj.type, "Kicked Client", "success")
			}
			else if (obj.type === "roomActionStartGame") {
				if (!isHost) {
					return client.message(obj.type, "Only Host Can Start", "error")
				}
				if (this.inGame) {
					return client.message(obj.type, "Already In Game", "error")
				}

				//Time to start the game.
				return this.startGame(obj.type)
			}
			else if (obj.type === "roomActionEndGame") {
				//Anybody can end the game, as they could do the same going AFK.
				if (!this.inGame) {
					return client.message(obj.type, "No Game In Progress", "error")
				}
				this.endGame(obj.type, clientId) //Clientid is an optional parameter.
			}
			else if (obj.type === "roomActionCloseRoom") {
				if (!isHost) {
					return client.message(obj.type, "Only Host Can Close Room", "error")
				}
				this.clientIds.slice(0).forEach((clientId) => {
					this.removeClient(clientId, "The room has been closed. ")
				})
				global.stateManager.deleteRoom(this.roomId)
			}
			else if (obj.type === "roomActionState") {
				return client.message(obj.type, getState(clientId), "success")
			}
		}).bind(this)

		this.toJSON = (function() {
			let obj = {
				roomId: this.roomId,
				options: {
					gameData: this.gameData,
					roomCreated: this.roomCreated,
					inGame: this.inGame,
					clientIds: this.clientIds,
					hostClientId: this.hostClientId
				}
			}
			console.log("Called")
			console.log(JSON.stringify(obj))
			return JSON.stringify(obj)
		}).bind(this)
	}

	static fromJSON(str, options = {}) {
		let obj = JSON.parse(str)

		if (!options.preverseRoomCreated) {
			//Default is to not preserve the game created time.
			delete obj.options.roomCreated
		}

		return new Room(obj.roomId, obj.options)
	}
}


module.exports = Room
