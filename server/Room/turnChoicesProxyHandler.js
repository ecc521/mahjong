const Match = require("../../src/Match.js")
const Sequence = require("../../src/Sequence.js")
const Hand = require("../../src/Hand.js")


let windOrder = ["north", "east", "south", "west"]

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

function getPriority(obj, key, exemptFromChecks = false) {
	if (this.gameData.charleston) {return true} //We don't validate these.
	if (obj[key] === "Next") {return true} //Valid, but no-op.

	let client = global.stateManager.getClient(key)
	let throwerWind = this.gameData.playerHands[this.gameData.currentTurn.userTurn].wind

	let hand = this.gameData.playerHands[key]
	hand.add(this.gameData.currentTurn.thrown)
	//wouldMakeMahjong will confirm that the current tile will allow mahjong to happen.
	let mahjongHand = hand.isMahjong()
	let wouldMakeMahjong = !!(mahjongHand);
	hand.remove(this.gameData.currentTurn.thrown)

	if (mahjongHand instanceof Hand && !exemptFromChecks) {
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

	if (obj[key].mahjong && !wouldMakeMahjong && !exemptFromChecks) {
		client.message("roomActionPlaceTiles", "Unable to detect a mahjong in your hand. (Press 'Mahjong' again to override). ", "error")
		return false;
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
			if (!wouldMakeMahjong && !exemptFromChecks) {
				client.message("roomActionPlaceTiles", "You can't place a pair when it will not make you mahjong. (Press 'Proceed' or 'Mahjong' again to override)", "error")
				return false;
			}
			else if (exemptFromChecks) {
				//Allow, and don't force mahjong.
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
		if (getBackwardsDistance(placerWind, throwerWind) > 1 && !exemptFromChecks) {
			client.message("roomActionPlaceTiles", "You can only take a sequence from the player before you, except with mahjong. (Press 'Proceed' again to override) ", "error")
			return false;
		}
		priority = 99
	}
	else {
		priority = 98
	}
	return [priority, key]
}

function calculateNextTurn(obj, exemptFromChecks) {
	//Obj is the turnChoices object.

	if (this.gameData.charleston) {
		//Note that the tiles being passed have already been removed from respective hands.
		let playerHands = []
		let placements = []
		for (let clientId in this.gameData.playerHands) {
			let hand = this.gameData.playerHands[clientId]
			let position = windOrder.indexOf(hand.wind)
			playerHands[position] = hand
			placements[position] = obj[clientId]
		}
		let currentDirection = this.gameData.charleston.directions.shift()

		let increment;
		console.log(currentDirection)
		switch (currentDirection) {
			case "right": increment = 1; break;
			case "across": increment = 2; break;
			case "left": increment = 3; break;
			case undefined: increment = 0; console.error("Charleston increment 0");break; //This should NEVER happen. But don't break if it does.
		}

		playerHands.forEach((hand, index) => {
			let placement = placements[index]
			console.log(index, increment)
			let passToIndex = (index+increment)%4

			placement.forEach((tile) => {
				console.log(playerHands)
				console.log(passToIndex)
				playerHands[passToIndex].add(tile)
			})
		})

		let nextDirection = this.gameData.charleston.directions[0]
		if (nextDirection) {
			this.messageAll([], "roomActionGameplayAlert", "The next charleston pass is going " + nextDirection , "success")
		}
		else {
			this.messageAll([], "roomActionGameplayAlert", "The charleston is over. Let the games begin! " , "success")
			this.gameData.charleston = false //The charleston is over.
		}
	}
	else {
		this.gameData.previousTurnPickedUp = true //Used for in-hand mahjong detection.

		//Handle this turn, and begin the next one.
		let priorityList = []
		for (let key in obj) {
			let res = getPriority.call(this, obj, key, exemptFromChecks.includes(key))
			if (res instanceof Array) {priorityList.push(res)}
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
							this.messageAll([clientId], "roomActionGameplayAlert", client.getNickname() + " has placed a sequence of " + placement.tiles[0].type + "s" , {clientId, speech: "Chow"})
							if (placement.mahjong) {
								this.goMahjong(clientId, undefined, exemptFromChecks.includes(clientId))
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
							let matchType = [,,"pair","pong","kong"][placement.amount]
							this.messageAll([clientId], "roomActionGameplayAlert", client.getNickname() + " has placed a " + matchType + " of " + placement.value + " " + placement.type + "s", {clientId, speech: matchType})
							if (placement.mahjong) {
								this.goMahjong(clientId, undefined, exemptFromChecks.includes(clientId))
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

let exemptFromChecks = []

module.exports = function(obj, prop, value) {
	obj[prop] = value
	//Remove invalid assignments. getPriority will issue error messages to clients as needed.
	if (getPriority.call(this, obj, prop, exemptFromChecks.includes(prop)) === false) {
		delete obj[prop]
		if (global.stateManager.getClient(prop).isBot) {
			console.log("Bots are not allowed to obtain override power. ")
		}
		else {
			exemptFromChecks.push(prop) //We will only block a client once per turn. Successive attempts will be treated as overrides.
		}
	}

	//The user can never pick up their own discard tile, hence is always "Next", except during charleston
	if (!this.gameData.charleston) {
		obj[this.gameData.currentTurn.userTurn] = "Next"
	}

	if (Object.keys(obj).length === 4) {
		calculateNextTurn.call(this, obj, exemptFromChecks)
		exemptFromChecks = []
	}

	return true
}
