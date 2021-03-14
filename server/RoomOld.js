const Wall = require("../src/Wall.js")
const Hand = require("../src/Hand.js")
const Tile = require("../src/Tile.js")
const Match = require("../src/Match.js")
const Pretty = require("../src/Pretty.js")
const Sequence = require("../src/Sequence.js")

class Room {
	constructor(roomId, state = {}, moves) {
		//Note: If loading from state, this.init() must be called.
		this.roomId = roomId

		//We only save state inside actual games. The first line will be for the room information itself - name, settings, etc,
		//and every successive line will be an action that was performed.

		this.state = state
		this.state.seed = this.state.seed || Math.random()

		this.state.settings = this.state.settings || {}

		this.state.settings.unlimitedSequences = false
		this.state.settings.charleston = ["across","right","left"] //TODO: This is probably the best default. We want a setting.
		//TODO: Add a setting for allowing blind passing tiles.
		//TODO: Add settings for 0/arbitrary number/unlimited sequences. Need to update isCalling for that as well.
		this.state.settings.botSettings = this.state.settings.botSettings || {}
		this.state.settings.botSettings.canCharleston = false
		this.state.settings.windAssignments = this.state.settings.windAssignments || {}

		//TODO: Currently, clientId of other users is shown to users in the same room, allowing for impersonation. This needs to be fixed by using different identifiers.

		this.moves = moves || [] //Will be saved seperately of other state.



		this.clientIds = this.state.clientIds || []
		this.inGame = false
		this.gameData = {}

		let _hostClientId;
		Object.defineProperty(this, "hostClientId", {
			set: function(id) {
				_hostClientId = id
				this.state.hostClientId = id
			},
			get: function() {return _hostClientId}
		})
		this.hostClientId = this.state.hostClientId

		let loadState = (function loadState() {
			if (this.state.wall) {
				console.time("Loading Room State... ")

				//Make sure we don't blast all the clients with repeat messages.
				this.clientIds.forEach(((clientId) => {
					let client = global.stateManager.getClient(clientId)
					client.suppress()
					if (client.getRoomId() === undefined) {client.setRoomId(this.roomId)}
				}).bind(this))

				let _moves = this.moves.slice(0)
				this.startGame({type: "roomActionStartGame", settings: this.state.settings})
				console.log(_moves)
				//These moves are going to get added back in...

				_moves.forEach((move) => {
					this.onPlace(...move)
				})

				this.clientIds.forEach((clientId) => {
					global.stateManager.getClient(clientId).unsuppress()
				})

				this.sendStateToClients()
				delete this.init
				console.timeEnd("Loading Room State... ")
			}
		}).bind(this)

		this.init = loadState

		this.startGame = (require("./Room/startGame.js")).bind(this)
		this.addBot = (require("./Room/addBot.js")).bind(this)

		this.getSummary = (function(mahjongClientId, drewOwnTile) {
			let summary = ""
			for (let id in this.gameData.playerHands) {
				summary += global.stateManager.getClient(id).getNickname()
				summary += ": "
				summary += this.gameData.playerHands[id].wind + ", "
				let points = this.gameData.playerHands[id].score()
				if (id === mahjongClientId) {
					points = this.gameData.playerHands[id].score({isMahjong: true, drewOwnTile})
				}
				summary += points + " points. "
				if (id === mahjongClientId) {
					summary += "(Mahjong)"
				}
				summary += "\n"
			}
			return summary
		}).bind(this)

		let shouldRotateWinds = true
		this.rotateWinds = function() {
			//We don't want to rotate until the game is actually ended - otherwise, we mess up state if the game is reverted.
			let winds = ["north", "east", "south", "west"].reverse()
			for (let clientId in this.state.settings.windAssignments) {
				let wind = this.state.settings.windAssignments[clientId]
				this.state.settings.windAssignments[clientId] = winds[(winds.indexOf(wind) + 1) % 4] //Next in order
			}
		}

		this.goMahjong = (function goMahjong(clientId, drewOwnTile = false, override = false) {
			//First, verify the user can go mahjong.
			let client = global.stateManager.getClient(clientId)

			let hand = this.gameData.playerHands[clientId]
			let isMahjong = hand.isMahjong(this.state.settings.unlimitedSequences)
			if (isMahjong instanceof Hand) {
				hand.contents = isMahjong.contents //Autocomplete the mahjong.
			}

			if (!isMahjong && !override) {
				return client.message("roomActionPlaceTiles", "Unable to go mahjong with this hand. If you play by different rules, try again to override. ", "error")
			}

			//The game is over.
			this.gameData.isMahjong = true
			this.sendStateToClients()
			//If East wins, do not rotate.
			if (this.state.settings.windAssignments[clientId] === "east") {
				shouldRotateWinds = false
			}

			this.messageAll([clientId], "roomActionGameplayAlert", client.getNickname() + " has gone mahjong" , {clientId, speech: "Mahjong"})
			this.messageAll([], "roomActionMahjong", this.getSummary(clientId, drewOwnTile), "success")
			this.sendStateToClients()
		}).bind(this)

		this.revertState = (function(moveCount) {
			//Reverts state, removing moveCount moves
			if (moveCount < 1) {return} //Block revert by zero or negative numbers.
			global.stateManager.deleteRoom(this.roomId)
			let room = new Room(this.roomId, this.state, this.moves.slice(0, -moveCount))
			global.stateManager.createRoom(this.roomId, room)
			room.init()
		}).bind(this)

		this.turnChoicesProxyHandler = {
			set: (require("./Room/turnChoicesProxyHandler.js")).bind(this)
		}

		let getState = (function getState(requestingClientId) {
			//Generate the game state visible to requestingClientId
			let state = {}
			state.inGame = this.inGame
			state.isHost = (requestingClientId === this.hostClientId);
			if (this.gameData.wall) {
				//Pass tiles if mahjong, else number of tiles.
				state.wallTiles = this.gameData.wall.tiles
				if (!this.gameData.isMahjong) {
					state.wallTiles = state.wallTiles.length
				}
			}

			state.settings = this.state.settings

			state.discardPile = this.gameData.discardPile

			if (this.gameData.currentTurn) {
				state.currentTurn = {
					thrown: this.gameData.currentTurn.thrown,
					userTurn: this.gameData.currentTurn.userTurn,
					playersReady: Object.keys(this.gameData.currentTurn.turnChoices || {})
				}

				if (this.gameData.charleston) {
					state.currentTurn.charleston = true
				}
			}

			state.clients = []
			this.clientIds.forEach((currentClientId) => {
				let visibleClientState = {
					id: currentClientId,
					nickname: global.stateManager.getClient(currentClientId).getNickname(),
					isHost: (currentClientId === this.hostClientId)
				}
				if (this.inGame) {
					let hand = this.gameData.playerHands[currentClientId]
					if (requestingClientId === currentClientId) {
						//One can see all of their own tiles.
						visibleClientState.hand = hand
					}
					else {
						if (!this.gameData.isMahjong && !this.gameData.wall.isEmpty) {
							//One can only see exposed tiles of other players. True says to include other tiles as face down.
							visibleClientState.visibleHand = hand.getExposedTiles(true)
						}
						else {
							//Game over. Show all.
							visibleClientState.visibleHand = hand.contents
						}
						visibleClientState.wind = hand.wind
					}
				}
				state.clients.push(visibleClientState)
			})

			return state
		}).bind(this)

		this.sendStateToClients = (function sendStateToClients() {
			this.clientIds.forEach((clientId) => {
				let client = global.stateManager.getClient(clientId)
				let state = getState(clientId)
				client.message("roomActionState", state, "success")
			})
		}).bind(this)

		this.addClient = (function(clientId) {
			if (this.clientIds.length >= 4) {
				//Alert the host somebody was blocked from joining.
				global.stateManager.getClient(this.hostClientId).message("roomActionGameplayAlert", global.stateManager.getClient(clientId).getNickname() + ` tried to join the room. `, "success")
				return "Room Full. You can ask the host to kick a player or bot. "
			}
			if (this.clientIds.includes(clientId)) {return "Already In Room"}
			if (!this.hostClientId) {this.hostClientId = clientId}
			this.clientIds.push(clientId)
			this.sendStateToClients()
			return true
		}).bind(this)

		this.removeClient = (function(clientId, explaination = "You left the room. ") {
			let clientIdIndex = this.clientIds.findIndex((currentClientId) => {return currentClientId === clientId})
			if (clientIdIndex === -1) {
				return "Client Not Found"
			}
			else {
				this.clientIds.splice(clientIdIndex, 1)
				if (this.hostClientId === clientId) {
					//Choose a new host client. Make sure NOT to pick a bot.
					this.hostClientId = null;
					this.clientIds.forEach(((clientId) => {
						if (this.hostClientId) {return}
						if (!global.stateManager.getClient(clientId).isBot) {
							this.hostClientId = clientId
						}
					}).bind(this))
				}
				this.sendStateToClients()

				let clientBeingKicked = global.stateManager.getClient(clientId)
				if (clientBeingKicked) {
					clientBeingKicked.message("roomActionLeaveRoom", explaination, "success")
					//The client is going to change their client Id. We can now delete the old client.
					global.stateManager.deleteClient(clientId)
				}
				if (this.hostClientId === null) {
					//We have no clients. Delete this room.
					//Note that this code shouldn't be called, unless there is a bug or lag. The client will not show the Leave Room button if they are the
					//only player and host (which they should be if they are the only player), and therefore roomActionCloseRoom will be sent instead.
					global.stateManager.deleteRoom(this.roomId)
				}
			}
		}).bind(this)

		this.messageAll = (function(exclude = [], ...args) {
			console.log(this.clientIds.length)
			this.clientIds.forEach((clientId) => {
				if (exclude.includes(clientId)) {return}
				let client = global.stateManager.getClient(clientId)
				client.message(...args)
			})
		}).bind(this)

		this.drawTile = (function drawTile(clientId, doNotMessage = false) {
			let tile;
			let pretty = -1
			while (!(tile instanceof Tile)) {
				pretty++
				tile = this.gameData.wall.drawFirst()
				if (!tile) {
					console.log("Wall Empty");
					this.messageAll([], "roomActionWallEmpty", this.getSummary(), "success")
					this.gameData.wall.isEmpty = true
					this.sendStateToClients() //Game over. Wall empty.
					return
				}
				this.gameData.playerHands[clientId].add(tile)
			}
			let client = global.stateManager.getClient(clientId)
			if (!doNotMessage) {
				client.message("roomActionGameplayAlert", "You drew " + ((pretty > 0?(pretty === 1)?"a pretty and a ":pretty + " prettys and a ":"a ")+ tile.value + " " + tile.type), {durationMultiplier: 1.5})
				if (pretty > 0) {
					this.messageAll([clientId], "roomActionGameplayAlert", client.getNickname() + " drew " + ((pretty === 1)?"a pretty!":pretty + " prettys!"), {clientId, speech: "I'm pretty!"})
				}
			}
			else if (pretty > 0) {
				//If doNotMessage is passed, this is beginning of game setup. We won't send anything other than "You drew a pretty" to avoid having multiple overlapping pieces of text.
				client.message("roomActionGameplayAlert", "You drew a pretty!", "success")
			}
		}).bind(this)

		this.endGame = (function endGame(obj, clientId) {
			let gameEndMessage = "The Game Has Ended";
			if (clientId) {
				let client = global.stateManager.getClient(clientId)
				//Tell players who ended the game.
				gameEndMessage = "The game has been ended by " + client.getNickname() + "."
			}
			if (shouldRotateWinds) {this.rotateWinds()}
			shouldRotateWinds = true
			this.inGame = false
			this.state.seed = Math.random()
			this.state.moves.length = 0 //Clear without resetting proxy.
			delete this.state.wall
			this.gameData = {}
			this.messageAll([clientId], obj.type, gameEndMessage, "success")
			this.sendStateToClients()
		}).bind(this)

		let placerMahjongOverride = false
		let placerSequenceOverride = false
		this.onPlace = (function(obj, clientId) {
			//Obj.message - a Tile, Match, or Sequence
			let move = [obj, clientId]
			this.moves.push(move)
			this.outputFile.write(JSON.stringify(move) + "\n")

			let client = global.stateManager.getClient(clientId)
			let hand = this.gameData.playerHands[clientId]

			if (this.gameData.isMahjong || this.gameData.wall.isEmpty) {
				return client.message(obj.type, "The game is over. If you wish to continue playing, you can end the game and start a new one, or revert the current game and see how it works playing a different way. ", "error")
			}

			let placement;
			try {
				placement = Hand.convertStringsToTiles(obj.message)
				console.log(obj.message)

				//The very first throw will determine if we charleston or not. Throwing one tile will start the game, throwing 3 will initiate charleston.
				if (this.state.settings.charleston.length > 0 && this.gameData.charleston === undefined && placement.length !== 1 && hand.wind === "east") {
					if (placement.length === 3) {
						this.gameData.charleston = {
							directions: this.state.settings.charleston.slice(0)
						}
						this.messageAll([], "roomActionGameplayAlert", "A charleston has begun. The first pass is going " + this.gameData.charleston.directions[0] , "success")
					}
					else if (!obj.mahjong) {
						return client.message(obj.type, "The very first throw must be either 1 tile, to initiate the game, or 3 tiles, to initiate charleston. ", "error")
					}
					else if (obj.mahjong) {
						placement = undefined
					}
				}
				else if (this.gameData.charleston) {
					if (placement.length !== 3) {
						return client.message(obj.type, "During charleston, you must pass exactly 3 tiles. ", "error")
					}
				}
				else if (placement.length > 1) {
					try {
						let sequence = new Sequence({exposed: true, tiles: placement})
						placement = sequence
					}
					catch (e) {
						if (Match.isValidMatch(placement)) {
							placement = new Match({exposed: true, amount: placement.length, type: placement[0].type, value: placement[0].value})
						}
						else {
							return client.message(obj.type, "Unable to create a sequence, or match. Please check your tiles. ", "error")
						}
					}
				}
				else {
					placement = placement[0]
					this.gameData.charleston = this.gameData.charleston || false
				}
			}
			catch (e) {
				return client.message(obj.type, "Error: " + e.message, "error")
			}
			//The users wishes to place down tiles.
			//If it is not their turn, we will hold until all other players have either attempted to place or nexted.
			//Then we will apply priority.

			if (placement instanceof Array) {
				//This should only happen if we are in a charleston. Remove the charleston tiles from their hand.
				if (this.gameData.currentTurn.turnChoices[clientId]) {
					return client.message(obj.type, "You have already passed tiles for this charleston round. ", "error")
				}
				if (hand.removeTilesFromHand(placement)) {
					console.log("Scheduling")
					this.gameData.currentTurn.turnChoices[clientId] = placement
					this.sendStateToClients()
				}
				else {
					return client.message(obj.type, "You can't pass tiles you don't possess. ", "error")
				}
			}
			else if (this.gameData.currentTurn.thrown === false || this.gameData.currentTurn.thrown === undefined) {
				if (clientId !== this.gameData.currentTurn.userTurn) {
					//This player is not allowed to perform any actions at this stage.
					return client.message(obj.type, "Can't place after draw before throw", "error")
				}
				if (placement instanceof Tile) {
					if (obj.mahjong) {
						return client.message(obj.type, "You can't discard and go mahjong. ", "error")
					}

					if (hand.removeMatchingTilesFromHand(placement)) {
						//If this is the 4th tile for an exposed pong in this hand, we will turn it into a kong and draw another tile.
						//TODO: Note that it is remotely possible players will want to throw the 4th tile instead, as it is a very safe (if honor, entirely safe), throw.
						//This would mean sacraficing points and a draw in order to get a safe throw, and I have never seen it done, but there are scenarios where it may
						//actually be the best idea. We should probably allow this at some point.
						if (hand.contents.some(((item) => {
							if (item instanceof Match && item.type === placement.type && item.value === placement.value) {
								item.amount = 4
								this.drawTile(clientId)
								return true
							}
							return false
						}).bind(this))) {
							this.messageAll([clientId], "roomActionGameplayAlert", client.getNickname() + " has upgraded an exposed pong into a kong. ", {clientId, speech: "Make that a kong", durationMultiplier: 1.1}) //Add duation. Long speech.
							this.sendStateToClients()
							return;
						}

						let tileName = placement.value + " " + placement.type
						let discardMessage = client.getNickname() + " has thrown a " + tileName
						//We're also going to check if the discarder is calling.
						let durationMultiplier = 1;
						if (!hand.calling && hand.isCalling(this.gameData.discardPile, this.state.settings.unlimitedSequences)) {
							hand.calling = true
							discardMessage += ", and is calling"
							durationMultiplier = 1.5
						}

						//Discard tile.
						this.gameData.currentTurn.thrown = placement
						this.gameData.currentTurn.turnChoices[clientId] = "Next"
						placerMahjongOverride = false
						this.sendStateToClients()
						this.messageAll([clientId], "roomActionGameplayAlert", discardMessage, {clientId, speech: tileName, durationMultiplier})
						console.log("Throw")
					}
					else {
						return client.message(obj.type, "You can't place a tile you do not possess", "error")
					}
				}
				else if (placement instanceof Match) {
					if (placement.amount === 4) {
						if (obj.mahjong) {
							return client.message(obj.type, "You can't go mahjong while placing a kong. ", "error")
						}
						if (hand.removeMatchingTilesFromHand(placement.getComponentTile(), 4)) {
							//Place Kong. Turn remains the same, thrown false.
							hand.contents.push(placement)
							//This must be an in hand kong, therefore we do not expose, although in hand kongs will be shown.
							placement.exposed = false
							//Draw them another tile.
							this.drawTile(clientId)
							this.sendStateToClients()
							this.messageAll([clientId], "roomActionGameplayAlert", client.getNickname() + " has placed an in-hand kong of " + placement.value + " " + placement.type + "s", {clientId, speech: "kong"})
							console.log("Kong")

						}
						else {
							return client.message(obj.type, "You can't place tiles you do not possess", "error")
						}
					}
					else {
						return client.message(obj.type, "Can't expose in hand pong, sequence, or pair. This can only be done via mahjong.", "error")
					}
				}
				else if (obj.mahjong) {
					this.goMahjong(clientId, !this.gameData.previousTurnPickedUp, placerMahjongOverride)
					if (global.stateManager.getClient(clientId).isBot) {
						console.log("Bots are not allowed to obtain override power")
					}
					else {
						placerMahjongOverride = true
					}
				}
				else {
					//TODO: This triggers attempting to place an in hand sequence. This is the wrong error message, although it is an error.
					return client.message(obj.type, "Invalid placement attempt for current game status", "error")
				}
			}
			else if (placement === undefined) {
				if (this.gameData.charleston) {
					return global.stateManager.getClient(clientId).message("roomActionPlaceTiles", "You must choose 3 tiles to pass during charleston. ", "error")
				}
				this.gameData.currentTurn.turnChoices[clientId] = "Next"
				this.sendStateToClients()
			}
			else {
				//This is not a discard, and it related to a throw, so must either be a pong, kong, sequence, or a pair if the user is going mahjong.
				if (obj.mahjong) {
					//Naked Mahjong
					placement.mahjong = obj.mahjong
				}
				else if (!(placement instanceof Match || placement instanceof Sequence)) {
					return client.message(obj.type, "You can't discard when it is not your turn", "error")
				}
				else if (placement instanceof Sequence && !this.state.settings.unlimitedSequences && !placerSequenceOverride) {
					if (hand.contents.some((item) => {return item instanceof Sequence})) {
						placerSequenceOverride = true //TODO: We should probably turn this override off at some point.
						return client.message(obj.type, "Host game settings allow only one sequence - try your same move again to ignore the one sequence setting and place your sequence. Overriding sequence settings may prevent 'calling' or 'ready' hands from being automatically detected. ", "error")
					}
				}
				//Schedule the order. It's validity will be checked later.
				console.log("Scheduling")
				this.gameData.currentTurn.turnChoices[clientId] = placement
				this.sendStateToClients()
			}
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
				return this.startGame(obj)
			}
			else if (obj.type === "roomActionEndGame") {
				//Anybody can end the game, as they could do the same going AFK.
				if (!this.inGame) {
					return client.message(obj.type, "No Game In Progress", "error")
				}
				this.endGame(obj, clientId) //Clientid is an optional parameter.
			}
			else if (obj.type === "roomActionCloseRoom") {
				if (!isHost) {
					return client.message(obj.type, "Only Host Can Close Room", "error")
				}

				let hostClientId = this.hostClientId //Host may change as people are removed.

				this.clientIds.slice(0).forEach((clientId) => {
					if (clientId !== hostClientId) {
						//Clone array to avoid shifting.
						this.removeClient(clientId, "The room has been closed. ")
					}
				})
				this.removeClient(hostClientId, "You closed the room. ")
				global.stateManager.deleteRoom(this.roomId)
			}
			else if (obj.type === "roomActionPlaceTiles") {
				//Action to place tiles.
				//Only current turn user can place.
				return this.onPlace(obj, clientId)
			}
			else if (obj.type === "roomActionAddBot") {
				if (!isHost) {
					return client.message(obj.type, "Only Host Can Add Bots", "error")
				}
				return this.addBot(obj)
			}
			else if (obj.type === "roomActionRevertState") {
				if (!isNaN(obj.message)) {
					this.messageAll([], "roomActionGameplayAlert", client.getNickname() + " is reverting the state " + Number(obj.message) + " moves. ", "success" )
					return this.revertState(Number(obj.message))
				}
				return client.message("roomActionGameplayAlert", "Invalid Reversion Amount", "error")
			}
			else if (obj.type === "roomActionState") {
				return client.message(obj.type, getState(clientId), "success")
			}
			else if (obj.type === "roomActionChangeNickname") {
				let message; //Message will remain undefined if the user does not have permission to rename.
				let target = global.stateManager.getClient(obj.targetId)

				if (obj.targetId === clientId) {
					message = target.getNickname() + " renamed to " + obj.nickname
				}
				else if (isHost) {
					message = "The host renamed " + target.getNickname() + " to " + obj.nickname
				}

				if (message) {
					target.setNickname(obj.nickname)
					this.messageAll([clientId], "roomActionGameplayAlert", message, "success" )
					this.sendStateToClients()
				}
				return
			}
		}).bind(this)

		this.toJSON = (function() {
			return [this.state, this.moves]
		}).bind(this)
	}

	static fromJSON(obj, keepGameStarted = false) {
		return new Room(obj.roomId, obj[0], obj[1])
	}
}


module.exports = Room
