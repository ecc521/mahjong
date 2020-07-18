const Wall = require("../src/Wall.js")
const Hand = require("../src/Hand.js")
const Tile = require("../src/Tile.js")
const Match = require("../src/Match.js")
const Pretty = require("../src/Pretty.js")
const Sequence = require("../src/Sequence.js")

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
			this.gameData.wall = Wall.fromJSON(this.gameData.wall)
		}

		if (this.gameData.discardPile) {
			this.gameData.discardPile = this.gameData.discardPile.map((str) => {return Tile.fromJSON(str)})
		}

		if (this.gameData.playerHands) {
			for (let clientId in this.gameData.playerHands) {
				this.gameData.playerHands[clientId] = Hand.fromString(this.gameData.playerHands[clientId])
			}
		}

		this.startGame = (require("./Room/startGame.js")).bind(this)

		let getSummary = (function(mahjongClientId, drewOwnTile) {
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

		let goMahjong = (function goMahjong(clientId, drewOwnTile = false) {
			//First, verify the user can go mahjong.
			let hand = this.gameData.playerHands[clientId]
			let isMahjong = hand.isMahjong(this.gameData.settings.unlimitedSequences)
			if (isMahjong instanceof Hand) {
				hand.contents = isMahjong.contents //Autocomplete the mahjong.
			}

			if (!isMahjong) {
				return global.stateManager.getClient(clientId).message("roomActionPlaceTiles", "Unable to go mahjong with this hand. ", "error")
			}

			//The game is over.
			this.gameData.isMahjong = true
			this.sendStateToClients()
			this.gameData.eastWindPlayerId = clientId //Whoever goes mahjong gets east next game./

			this.messageAll([], "roomActionMahjong", getSummary(clientId, drewOwnTile), "success")
			this.sendStateToClients()
		}).bind(this)

		this.turnChoicesProxyHandler = {
			set: (function(obj, prop, value) {
				obj[prop] = value
				//The user can never pick up their own discard tile, hence is always "Next", except during charleston
				if (!this.gameData.charleston) {
					obj[this.gameData.currentTurn.userTurn] = "Next"
				}

				let windOrder = ["north", "east", "south", "west"]
				let throwerWind = this.gameData.playerHands[this.gameData.currentTurn.userTurn].wind

				function getBackwardsDistance(placerWind, throwerWind) {
					//total is the distance backwards from the placer to the thrower.
					let i = windOrder.indexOf(placerWind)
					let total = 0;
					while (windOrder[i] !== throwerWind) {
						total++;
						i--;
						if (i===-1) {
							i=windOrder.length-1
						}
					}
					return total
				}

				if (Object.keys(obj).length === 4) {

					if (this.gameData.charleston) {
						//Note that the tiles being passed have already been removed from respective hands.
						let winds = ["north", "east", "south", "west"]
						let playerHands = []
						let placements = []
						for (let clientId in this.gameData.playerHands) {
							let hand = this.gameData.playerHands[clientId]
							let position = winds.indexOf(hand.wind)
							playerHands[position] = hand
							placements[position] = obj[clientId]
						}

						let currentDirection = this.gameData.charleston.directions.shift()

						let increment;
						switch (currentDirection) {
							case "right": increment = 1; break;
							case "across": increment = 2; break;
							case "left": increment = 3; break;
						}

						playerHands.forEach((hand, index) => {
							let placement = placements[index]
							let passToIndex = (index+increment)%4

							placement.forEach((tile) => {
								playerHands[passToIndex].add(tile)
							})
						})

						let nextDirection = this.gameData.charleston.directions[0]
						if (nextDirection) {
							this.messageAll([], "roomActionGameplayAlert", "The next charleston pass is going " + nextDirection , "success")
						}
						else {
							this.messageAll([], "roomActionGameplayAlert", "The charleston is over. Let the games begin! " , "success")
							this.gameData.charleston = false//The charleston is over.
						}
					}
					else {
						this.gameData.previousTurnPickedUp = true //Used for in-hand mahjong detection.

						//Handle this turn, and begin the next one.
						let priorityList = []
						for (let key in obj) {
							let client = global.stateManager.getClient(key)
							if (obj[key] !== "Next") {

								let hand = this.gameData.playerHands[key]
								hand.add(this.gameData.currentTurn.thrown)
								//wouldMakeMahjong will confirm that the current tile will allow mahjong to happen.
								let mahjongHand = hand.isMahjong()
								let wouldMakeMahjong = !!(mahjongHand);
								hand.remove(this.gameData.currentTurn.thrown)

								if (mahjongHand instanceof Hand) {
									//Determine if the possible mahjong contains the specified placement, and if not, notify user and drop mahjong priority.
									let stringContents = mahjongHand.getStringContents()
									//Exposed vs unexposed can cause issues comparing strings. Need a .matches in future.
									let previousValue = obj[key].exposed
									obj[key].exposed = false
									let unexposed = obj[key].toJSON()
									obj[key].exposed = true
									let exposed = obj[key].toJSON()
									obj[key].exposed = previousValue

									if (!(stringContents.includes(unexposed) || stringContents.includes(exposed))) {
										wouldMakeMahjong = false
									}
								}

								if (obj[key].mahjong && !wouldMakeMahjong) {
									client.message("roomActionPlaceTiles", "You can't go mahjong at this moment. Your placement will be considered without mahjong priority applied. ", "error")
								}

								let priority;
								let placerWind = hand.wind
								if (wouldMakeMahjong && obj[key].mahjong) {
									priority = 109
									let total = getBackwardsDistance(placerWind, throwerWind)
									console.log(total)
									priority -= total
								}
								else if (obj[key] instanceof Match) {
									//Validate that this is not a pair.
									if (obj[key].amount === 2) {
										if (!wouldMakeMahjong) {
											client.message("roomActionPlaceTiles", "You can't place a pair when it will not make you mahjong. ", "error")
											continue;
										}
										else {
											placement.mahjong = true //The specified action can only be accomplished through mahjong.
										}
									}
									priority = 104;
									//Add priority based on position to thrower. The closer to the thrower, the highest priority.
									let total = getBackwardsDistance(placerWind, throwerWind)
									console.log(total)
									priority -= total
								}
								else if (obj[key] instanceof Sequence) {
									//Verify that the user is the one immediently before.
									if (getBackwardsDistance(placerWind, throwerWind) > 1) {
										console.log("Greater than one person distance on sequence. Denied. ")
										client.message("roomActionPlaceTiles", "You can only take a sequence from the player before you in the rotation order, except with mahjong.", "error")
										continue;
									}
									priority = 99
								}
								else {
									priority = 98
								}
								priorityList.push([priority, key])
							}
						}
						//If anybody attempted to place, time to process them.
						let utilized = false; //Did we use the thrown tile?
						console.log(priorityList.length)
						if (priorityList.length !== 0) {
							//Sort highest to lowest
							priorityList.sort((a, b) => {return b[0] - a[0]})
							for (let i=0;i<priorityList.length;i++) {
								console.log("Here 1")
								let clientId = priorityList[i][1]
								let client = global.stateManager.getClient(clientId)

								if (utilized === true) {
									client.message("roomActionPlaceTiles", "Placing tiles failed because another player had a higher priority placement (mahjong>match>sequence, and by order within category).", "error")
									continue;
								}

								let placement = obj[clientId]
								//If placement succeeds, switch userTurn
								console.log(placement)
								if (placement instanceof Sequence) {
									//Confirm that the sequence uses the thrown tile.
									let valid = false
									placement.tiles.forEach((tile) => {
										console.log(tile)
										console.log(this.gameData.currentTurn.thrown)
										if (tile.value === this.gameData.currentTurn.thrown.value && tile.type === this.gameData.currentTurn.thrown.type) {
											valid = true
										}
									})
									console.log(valid)
									if (valid) {
										let hand = this.gameData.playerHands[clientId]
										//Add the tile to hand, attempt to verify, and, if not, remove
										hand.add(this.gameData.currentTurn.thrown)
										if (hand.removeTilesFromHand(placement)) {
											utilized = true
											hand.add(placement)
											placement.exposed = true
											this.messageAll([clientId], "roomActionGameplayAlert", client.getNickname() + " has placed a sequence of " + placement.tiles[0].type + "s" , "success")
											if (placement.mahjong) {
												goMahjong(clientId)
											}
											this.gameData.currentTurn.userTurn = clientId
										}
										else {
											hand.remove(this.gameData.currentTurn.thrown)
											client.message("roomActionPlaceTiles", "You can't place a sequence of tiles you do not possess", "error")
										}
									}
									else {
										client.message("roomActionPlaceTiles", "Are you trying to hack? You must use the thrown tile when attempting to place off turn. ", "error")
									}
								}
								else if (placement instanceof Match) {
									//Confirm that the match uses the thrown tile
									if (placement.value === this.gameData.currentTurn.thrown.value && placement.type === this.gameData.currentTurn.thrown.type) {
										let hand = this.gameData.playerHands[clientId]
										//We can just verify for on less tile here.

										if (hand.removeMatchingTilesFromHand(placement.getComponentTile(), placement.amount - 1)) {
											utilized = true
											hand.add(placement)
											placement.exposed = true
											this.messageAll([clientId], "roomActionGameplayAlert", client.getNickname() + " has placed a " + [,,"pair","pong","kong"][placement.amount] + " of " + placement.value + " " + placement.type + "s", "success")
											if (placement.mahjong) {
												goMahjong(clientId)
											}
											if (placement.amount === 4) {
												//Draw them another tile.
												this.drawTile(clientId, true) //Draw from back of wall.
											}
											this.gameData.currentTurn.userTurn = clientId
										}
										else {
											console.log("Attempted to place invalid match")
											client.message("roomActionPlaceTiles", "You can't place a match of tiles you do not possess", "error")
										}
									}
								}
							}
						}

						if (utilized === false) {
							this.gameData.previousTurnPickedUp = false

							//Shift to next player, draw them a tile.
							let nextWind = windOrder[(windOrder.indexOf(this.gameData.playerHands[this.gameData.currentTurn.userTurn].wind) + 1)%4]

							for (let clientId in this.gameData.playerHands) {
								let hand = this.gameData.playerHands[clientId]
								if (hand.wind === nextWind) {

									//Pick up as 4th tile for an exposed pong if possible.
									//TODO: Consider notifying people when the 4th tile is added. We currently don't do this, because it is just points, so shouldn't really impact
									//gameplay, and the message can't currently be sent to the person who gained the pickup, as they receive tile pickup message too.
									hand.contents.forEach((item) => {
										if (item instanceof Match && item.type === this.gameData.currentTurn.thrown.type && item.value === this.gameData.currentTurn.thrown.value) {
											utilized = true
											item.amount = 4
										}
									})

									//Switch the turn, and draw the next tile.
									if (utilized === false) {
										this.gameData.discardPile.push(this.gameData.currentTurn.thrown)
										this.drawTile(clientId)
									}
									else {
										this.drawTile(clientId, true)
									}

									this.gameData.currentTurn.userTurn = clientId
								}
							}
						}
						this.gameData.currentTurn.thrown = false
					}

					//Clear the object.
					for (let key in obj) {delete obj[key]}
					this.sendStateToClients()
				}

				return true
			}).bind(this)
		}

		if (this.gameData.currentTurn) {
			if (this.gameData.currentTurn.turnChoices) {
				//TODO: We need to properly unstrignify turnChoices.
				this.gameData.currentTurn.turnChoices = new Proxy(this.gameData.currentTurn.turnChoices, this.turnChoicesProxyHandler)
			}
			if (this.gameData.currentTurn.thrown) {this.gameData.currentTurn.thrown = Tile.fromJSON(this.gameData.currentTurn.thrown)}
		}

		let getState = (function getState(requestingClientId) {
			//Generate the game state visible to requestingClientId
			let state = {}
			state.inGame = this.inGame
			state.isHost = (requestingClientId === this.hostClientId);
			if (this.gameData.wall) {
				state.wallTiles = this.gameData.wall.tiles.length
			}

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
						if (!this.gameData.isMahjong) {
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
				return "Room Full"
			}
			if (this.clientIds.includes(clientId)) {return "Already In Room"}
			if (!this.hostClientId) {this.hostClientId = clientId}
			this.clientIds.push(clientId)
			this.sendStateToClients()
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
				this.sendStateToClients()

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

		this.messageAll = (function(exclude = [], ...args) {
			console.log(this.clientIds.length)
			this.clientIds.forEach((clientId) => {
				if (exclude.includes(clientId)) {return}
				console.log("Messaging client " + clientId)
				let client = global.stateManager.getClient(clientId)
				client.message(...args)
			})
		}).bind(this)

		this.drawTile = (function drawTile(clientId, last = false, doNotMessage = false) {
			let tile;
			let pretty = -1
			while (!(tile instanceof Tile)) {
				pretty++
				if (last) {
					tile = this.gameData.wall.drawLast()
				}
				else {
					tile = this.gameData.wall.drawFirst()
				}
				if (!tile) {
					console.log("Wall Empty");
					this.messageAll([], "roomActionWallEmpty", getSummary(), "success")
					if (!this.gameData.eastWindPlayerId) {
						for (let clientId in this.gameData.playerHands) {
							if (this.gameData.playerHands[clientId].wind === "south") {
								this.gameData.eastWindPlayerId = clientId
							}
						}
					}
					this.sendStateToClients() //Game over. Wall empty.
					return
				}
				this.gameData.playerHands[clientId].add(tile)
			}
			if (!doNotMessage) {
				global.stateManager.getClient(clientId).message("roomActionGameplayAlert", "You drew " + ((pretty > 0?(pretty === 1)?"a pretty and a ":pretty + " prettys and a ":"a ")+ tile.value + " " + tile.type), "success")
			}
			else if (pretty > 0) {
				//If doNotMessage is passed, this is beginning of game setup. We won't send anything other than "You drew a pretty" to avoid having multiple overlapping pieces of text.
				global.stateManager.getClient(clientId).message("roomActionGameplayAlert", "You drew a pretty!", "success")
			}
		}).bind(this)

		this.endGame = (function endGame(obj, clientId) {
			let gameEndMessage = "The Game Has Ended";
			if (clientId) {
				let client = global.stateManager.getClient(clientId)
				//Tell players who ended the game, so blame can be applied.
				gameEndMessage = "The game has been ended by " + clientId + ", who goes by the name of " + client.getNickname() + "."
			}
			this.inGame = false
			this.gameData = {eastWindPlayerId: this.gameData.eastWindPlayerId}
			this.messageAll([], obj.type, gameEndMessage, "success")
			this.sendStateToClients()
		}).bind(this)

		this.onPlace = (function(obj, clientId) {
			//Obj.message - a Tile, Match, or Sequence
			console.log(obj, clientId)
			let client = global.stateManager.getClient(clientId)
			let hand = this.gameData.playerHands[clientId]

			let placement;
			try {
				placement = Hand.convertStringsToTiles(obj.message)
				console.log(obj.message)

				//The very first throw will determine if we charleston or not. Throwing one tile will start the game, throwing 3 will initiate charleston.
				if (this.gameData.settings.charleston && this.gameData.charleston === undefined && placement.length !== 1 && hand.wind === "east") {
					if (placement.length === 3) {
						this.gameData.charleston = {
							directions: this.gameData.settings.charleston
						}
						this.messageAll([], "roomActionGameplayAlert", "A charleston has begun. The first pass is going " + this.gameData.charleston.directions[0] , "success")
					}
					else {
						return client.message(obj.type, "The very first throw must be either 1 tile, to initiate the game, or 3 tiles, to initiate charleston. ", "error")
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
				if (hand.removeTilesFromHand(placement)) {
					console.log("Scheduling")
					this.gameData.currentTurn.turnChoices[clientId] = placement
					this.sendStateToClients()
				}
				else {
					return client.message(obj.type, "You can't pass tiles you don't possess. ", "error")
				}
			}
			else if (this.gameData.currentTurn.thrown === false) {
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
								this.drawTile(clientId, true)
								return true
							}
							return false
						}).bind(this))) {
							this.messageAll([clientId], "roomActionGameplayAlert", client.getNickname() + " has upgraded an exposed pong into a kong. ", "success")
							this.sendStateToClients()
							return;
						}

						let discardMessage = client.getNickname() + " has thrown a " + placement.value + " " + placement.type
						//We're also going to check if the discarder is calling.
						if (!hand.calling && hand.isCalling(this.gameData.discardPile, this.gameData.settings.unlimitedSequences)) {
							hand.calling = true
							discardMessage += ", and is calling"
						}

						//Discard tile.
						this.gameData.currentTurn.thrown = placement
						this.gameData.currentTurn.turnChoices[clientId] = "Next"
						this.sendStateToClients()
						this.messageAll([clientId], "roomActionGameplayAlert", discardMessage, "success")
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
							this.drawTile(clientId, true) //Draw from back of wall.
							this.sendStateToClients()
							this.messageAll([clientId], "roomActionGameplayAlert", client.getNickname() + " has placed an in-hand kong of " + placement.value + " " + placement.type + "s", "success")
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
					goMahjong(clientId, !this.gameData.previousTurnPickedUp)
				}
				else {
					return client.message(obj.type, "Invalid placement attempt for current game status", "error")
				}
			}
			else {
				//This is not a discard, and it related to a throw, so must either be a pong, kong, sequence, or a pair if the user is going mahjong.
				if (!(placement instanceof Match || placement instanceof Sequence)) {
					return client.message(obj.type, "You can't discard when it is not your turn", "error")
				}
				if (placement instanceof Sequence && !this.gameData.settings.unlimitedSequences) {
					if (hand.contents.some((item) => {return item instanceof Sequence})) {
						return client.message(obj.type, "unlimitedSequences is off, so you can't place another sequence. ", "error")
					}
				}
				//Schedule the order. It's validity will be checked later.
				console.log("Scheduling")
				placement.mahjong = obj.mahjong
				this.gameData.currentTurn.turnChoices[clientId] = placement
				this.sendStateToClients()
			}
		}).bind(this)

		this.onNext = (function(obj, clientId) {
			if (this.gameData.charleston) {
				return global.stateManager.getClient(clientId).message("roomActionPlaceTiles", "You can't \"Next\" a charleston. You must choose 3 tiles to pass. ", "error")
			}
			if (!this.gameData.currentTurn.thrown) {
				return global.stateManager.getClient(clientId).message("roomActionPlaceTiles", "There is currently nothing to next. ", "error")
			}
			this.gameData.currentTurn.turnChoices[clientId] = "Next"
			this.sendStateToClients()
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
				this.clientIds.slice(0).forEach((clientId) => {
					this.removeClient(clientId, "The room has been closed. ")
				})
				global.stateManager.deleteRoom(this.roomId)
			}
			else if (obj.type === "roomActionPlaceTiles") {
				//Action to place tiles.
				//Only current turn user can place.
				return this.onPlace(obj, clientId)
			}
			else if (obj.type === "roomActionNextTurn") {
				//Action to state next turn.
				return this.onNext(obj, clientId)
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
