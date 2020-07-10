const Tile = require("./Tile.js")
const Match = require("./Match.js")
const Sequence = require("./Sequence.js")
const Pretty = require("./Pretty.js")
const Wall = require("./Wall.js")

class Hand {
	constructor(config = {}) {
		//handForExposed - Optional. If exposed tiles should be placed in a seperate hand, they will be placed here.
		//interactive: Can the user drag and drop to reorder?
		//tilePlacemat: Element that will allow user to select tiles to expose.
		this.handToRender = config.handToRender
		this.handForExposed = config.handForExposed
		this.tilePlacemat = config.tilePlacemat
		this.interactive = config.interactive || false
		this.wind = config.wind

		//We will also have one events: this.onPlacematChange

		this.contents = [] //Contents of hand.
		this.inPlacemat = [] //Additional contents of hand. In placemat.

		this.add = (function(obj) {
			//We will insert the tile where our sorting algorithm would find it most appropriate.
			//TODO: this should probably receive some improvement, as if the user changes the location of suits, or puts, say honors first, it will fail to properly insert.
			let newItemScore;
			if (obj instanceof Sequence) {
				newItemScore = Hand.getTileValue(obj.tiles[0]) //Use value of first tile in sequence.
			}
			else {
				newItemScore = Hand.getTileValue(obj)
			}

			for (let i=0;i<this.contents.length;i++) {
				//Find where to insert this tile.
				let currentItem = this.contents[i]
				if (currentItem instanceof Sequence) {
					//Not quite sure how to handle this.
					currentItem = currentItem.tiles[2] //Get the value using the last tile in sequence.
				}
				let currentScore = Hand.getTileValue(currentItem) //Value of the tile in that position

				if (newItemScore < currentScore) {
					this.contents.splice(i, 0, obj)
					return
				}
			}
			this.contents.push(obj)
		}).bind(this)

		this.remove = (function(obj) {
			console.log(obj)
			let index = this.contents.findIndex((value) => {return value === obj})
			let placematIndex = this.inPlacemat.findIndex((value) => {return value === obj})
			if (index !== -1) {
				this.contents.splice(index, 1)
			}
			else if (placematIndex !== -1) {
				this.inPlacemat.splice(placematIndex, 1)
			}
			else {throw obj + " does not exist in hand. "}
		}).bind(this)

		this.getExposedTiles = (function(includeFaceDown = false) {
			let exposedTiles = []
			this.contents.forEach((item) => {
				if (item.exposed) {
					exposedTiles.push(item)
				}
				else if (item instanceof Match && item.amount === 4) {
					//If it is stored as a match, but not exposed, is in hand kong.
					//Is not stored as a match if the user never placed them downw
					exposedTiles.push(item)
				}
				else if (includeFaceDown) {
					exposedTiles.push(new Tile({faceDown: true}))
				}
			})
			return exposedTiles
		}).bind(this)

		this.syncContents = (function(syncContents) {
			//We allow the user to sort their hand by themselves, however it is possible that, due to lag or other reasons, the users hand ends up not matching the server.
			//This function will sync the contents of the users hand with contents, preserving some user ordering.

			let currentContentsStrings = [];
			let syncContentsStrings = [];

			console.log(this.contents.length)
			this.contents.forEach((item) => {
				currentContentsStrings.push(item.toJSON())
			})
			console.log(this.inPlacemat.length)
			this.inPlacemat.forEach((item) => {
				if (item.evicting) {return}
				currentContentsStrings.push(item.toJSON())
			})

			syncContents.forEach((item) => {
				syncContentsStrings.push(item.toJSON())
			})

			//Let's go through both arrays, and see what needs to change.
			//We'll stringify, because these are not identical instances, and therefore == will not work.
			for (let i=0;i<currentContentsStrings.length;i++) {
				let str = currentContentsStrings[i]
				if (str && syncContentsStrings.includes(str)) {
					currentContentsStrings[i] = null
					syncContentsStrings[syncContentsStrings.indexOf(str)] = null
				}
			}

			//Save tempContents now, because we add items to the array later, and they mess up ordering otherwise.
			let tempContents = this.contents.slice(0) //We are cloning the array, however the referenced objects remain the same. This prevents us from having to adjust indexes for items when we remove other items.
			if (this.inPlacemat[0] && this.inPlacemat[0].evicting) {
				tempContents = tempContents.concat(this.inPlacemat.slice(1))
			}
			else {
				tempContents = tempContents.concat(this.inPlacemat.slice(0))
			}

			//Everything that matches is now nulled out.
			//Add the things in syncContents but not in currentContents
			for (let i=0;i<syncContentsStrings.length;i++) {
				let item = syncContentsStrings[i]
				if (item) {
					this.add(syncContents[i])
				}
			}

			for (let i=0;i<currentContentsStrings.length;i++) {
				let item = currentContentsStrings[i]
				if (item) {
					this.remove(tempContents[i])
				}
			}
		}).bind(this)

		function allowDrop(ev) {
			ev.preventDefault();
		}

		function dragstart(ev) {
			let randomClass = "randomClassForTransfer" + (2**53) * Math.random()
			ev.target.classList.add(randomClass)
			ev.dataTransfer.setData("randomClass", randomClass);
		}

		let dropOnHand = (function dropOnHand(ev) {
			ev.preventDefault();
			let randomClass = ev.dataTransfer.getData("randomClass");
			let elem = document.getElementsByClassName(randomClass)[0]
			elem.classList.remove(randomClass)

			let dropPosition = ev.x
			let targetBounds = ev.target.getBoundingClientRect()

			let targetIndex = ev.target.tileIndex

			if (targetBounds.right - ev.x < targetBounds.width/2) {
				//Dropped on right side of tile. Insert after.
				targetIndex++
			}

			let targetTile = this.contents[targetIndex]

			let currentTile;
			if (elem.placematIndex !== undefined) {
				//We are dragging out of the placemat, into the hand.
				if (elem.placematIndex === 0 && this.inPlacemat[0].evicting) {
					console.log("Blocked dragging of evictingThrownTile")
					alert("You can't bring the thrown tile into your hand. You can only place it down along with other tiles that match it or form a sequence. ")
					return;
				}
				currentTile = this.inPlacemat.splice(elem.placematIndex, 1)[0]
			}
			else {
				//Reordering hand.
				currentTile = this.contents.splice(elem.tileIndex, 1)[0]
			}

			if (targetIndex <= this.contents.length) {
				let newTargetIndex = this.contents.findIndex((tile) => {return targetTile === tile})

				this.contents.splice(newTargetIndex, 0, currentTile)
			}
			else {
				this.contents.push(currentTile)
			}

			this.renderTiles() //Re-render.
		}).bind(this)

		let dropOnPlacemat = (function dropOnPlacemat(ev) {
			ev.preventDefault();
			let randomClass = ev.dataTransfer.getData("randomClass");
			let elem = document.getElementsByClassName(randomClass)[0]
			elem.classList.remove(randomClass)

			let currentTile = this.contents[elem.tileIndex]

			if (!currentTile) {return}

			if (this.inPlacemat.length >= 4) {
				alert("Placemat is already full. ")
				return
			}
			else {
				this.inPlacemat.push(this.contents.splice(elem.tileIndex, 1)[0])
			}
			this.renderTiles()


		}).bind(this)

		if (this.interactive) {
			this.handToRender.addEventListener("dragover", allowDrop)
			this.handToRender.addEventListener("dragenter", allowDrop)
			this.handToRender.addEventListener("drop", dropOnHand)

			if (this.tilePlacemat) {
				this.tilePlacemat.addEventListener("dragover", allowDrop)
				this.tilePlacemat.addEventListener("dragenter", allowDrop)
				this.tilePlacemat.addEventListener("drop", dropOnPlacemat)

				this.tilePlacemat.addEventListener("dragover", function() {
					this.style.backgroundColor = "lightblue"
				})
				this.tilePlacemat.addEventListener("dragleave", function() {
					this.style.backgroundColor = ""
				})
				this.tilePlacemat.addEventListener("drop", function() {
					this.style.backgroundColor = ""
				})
			}
		}


		this.removeTilesFromHand = (function removeTilesFromHand(obj, amount = 1, simulated = false) {
			//We will verify that the tiles CAN be removed before removing them.
			let contents = this.getStringContents()
			let toRemove = obj.toJSON()

			let indexes = []
			contents.forEach((str, index) => {
				if (toRemove === str) {indexes.push(index)}
			})

			if (indexes.length >= amount) {
				if (simulated) {return true}
				for (let i=0;i<amount;i++) {
					this.contents.splice(indexes[indexes.length - 1 - i], 1) //Remove the item the farthest back in the hand to avoid position shifting.
				}
				return true
			}
			else {return false}
		}).bind(this)

		this.removeSequenceFromHand = (function removeSequenceFromHand(sequence, simulated = false) {
			//We will verify that the tiles CAN be removed before removing them.
			let contents = this.getStringContents()
			let indexes = []
			JSON.parse(JSON.stringify(sequence.tiles)).forEach((str, index) => {
				for (let i=contents.length-1;i>=0;i--) {
					if (contents[i] === str) {
						indexes[index] = i
						return
					}
				}
			})
			if (indexes[0] !== undefined && indexes[1] !== undefined && indexes[2] !== undefined) {
				if (simulated) {return true}
				//Remove the item the farthest back in the hand to avoid position shifting.
				indexes.sort((a,b) => {return b-a}).forEach((index) => {
					this.contents.splice(index, 1)
				})
				return true
			}
			else {return false}
		}).bind(this)


		this.renderPlacemat = (function(classForFirst) {
			while (this.tilePlacemat.firstChild) {this.tilePlacemat.firstChild.remove()} //Delete everything currently rendered in the hand.

			for (let i=0;i<4;i++) {
				let tile = this.inPlacemat[i]
				let elem = document.createElement("img")
				if (i === 0 && classForFirst) {
					elem.className = classForFirst
				}
				if (tile) {
					elem.src = tile.imageUrl
					//Both work. Using i is faster and simpler.
					elem.placematIndex = i //this.inPlacemat.findIndex((item) => {return item === tile})
					elem.addEventListener("dragstart", dragstart)
				}
				else {
					elem.src = "assets/tiles/tile-outline.png"
				}
				this.tilePlacemat.appendChild(elem)
			}


		}).bind(this)

		this.setEvictingThrownTile = (function(tile) {
			//Clear the other evicting tile, even if it's position has moved due to some glitch or user hacking.
			for (let i=this.inPlacemat.length - 1;i>=0;i--) {
				let item = this.inPlacemat[i]
				if (item.evicting) {
					this.inPlacemat.splice(i, 1)
				}
			}
			if (tile) {
				if (this.inPlacemat.length >= 4) {
					this.contents.push(this.inPlacemat.pop())
				}
				this.inPlacemat.unshift(tile)
				tile.evicting = true
			}
		}).bind(this)

		this.renderTiles = (function() {

			if (!this.handToRender) {throw "Unable to render hand. You must pass config.handToRender to the constructor. "}

			while (this.handToRender.firstChild) {this.handToRender.firstChild.remove()} //Delete everything currently rendered in the hand.
			if (this.handForExposed) {
				while (this.handForExposed.firstChild) {this.handForExposed.firstChild.remove()} //Delete everything currently rendered in the hand.
			}

			let unexposedTiles = []
			let exposedTiles = []

			for (let i=0;i<this.contents.length;i++) {
				let item = this.contents[i]
				if (item instanceof Tile)	{
					unexposedTiles.push(item)
				}
				else if (item instanceof Pretty) {
					exposedTiles.push(item)
				}
				else if (item instanceof Match || item instanceof Sequence) {
					let items = item.tiles;
					if (item instanceof Match) {
						if (item.amount === 4) {
							//kong. Flip 1 tile.
							items[0] = new Tile({faceDown: true})
						}
					}
					if (item.exposed) {
						exposedTiles = exposedTiles.concat(items)
					}
					else {
						if (item instanceof Match && item.amount === 4) {
							//In hand kong. Expose with 2 flipped tiles. (One already flipped)
							items[3] = new Tile({faceDown: true})
							exposedTiles.concat(items)
						}
						else {
							unexposedTiles = tiles.concat(items)
						}
					}
				}
				else {console.error("Unknown item " + item)}
			}

			let drawTiles = (function drawTiles(tiles, type) {
				for (let i=0;i<tiles.length;i++) {
					let tile = tiles[i]
					let elem = document.createElement("img")
					elem.src = tile.imageUrl

					if (type === "exposed" && this.handForExposed) {
						this.handForExposed.appendChild(elem)
					}
					else if (type === "exposed") {
						this.handToRender.appendChild(elem)
					}
					else if (type === "unexposed"){
						if (this.interactive) {
							elem.draggable = true
							elem.addEventListener("dragstart", dragstart)
							elem.tileIndex = this.contents.findIndex((item) => {return item === tile})
						}
						this.handToRender.appendChild(elem)
					}
				}
			}).bind(this)

			drawTiles(exposedTiles, "exposed")
			drawTiles(unexposedTiles, "unexposed")
			if (this.tilePlacemat) {
				this.renderPlacemat()
			}
		}).bind(this)

		this.getStringContents = (function(prop = "contents") {
			//Can also pass "inPlacemat" for placemat contents.
			return JSON.parse(JSON.stringify(this[prop]))
		}).bind(this)

		this.toJSON = (function() {
			return JSON.stringify({
				wind: this.wind,
				contents: this.contents
			})
		}).bind(this)
	}

	static getTileValue(tile) {
		//The greater the value, the further to the right we place the tile.
		let tileValue = 0

		tileValue += 100 * ["pretty", "circle", "bamboo", "character", "wind", "dragon"].findIndex((suit) => {return tile.type === suit})

		if (typeof tile.value === "number") {tileValue += tile.value}
		else if (tile.type === "wind") {
			tileValue += 10 * ["north", "east", "south", "west"].findIndex((value) => {return tile.value === value})
		}
		else if (tile.type === "dragon") {
			tileValue += 10 * ["red", "green", "white"].findIndex((value) => {return tile.value === value})
		}
		else if (!tile.faceDown) {console.error("Couldn't fully calculate value for " + tile)}
		return tileValue
	}

	static sortTiles(tiles) {
		return tiles.sort(function (tile1, tile2) {
			return Hand.getTileValue(tile1) - Hand.getTileValue(tile2)
		})
	}

	static scoreHand(hand, config = {}) {
		if (hand instanceof Hand) {hand = hand.contents}
		//Hand is an array of arrays of Tiles, Matches, and Prettys

		let doubles = 0
		let score = 0
		let sequences = false

		if (!config.userWind) {console.warn("scoreHand not provided config.userWind, may result in improper scoring. ")}

		for (let i=0;i<hand.length;i++) {
			let match = hand[i]
			doubles += match.isDouble(config.userWind)
			score += match.getPoints(config.userWind)
			sequences = sequences || match.isSequence
		}

		if (config.isMahjong) {
			score += 20
			if (config.drewOwnTile) {
				score += 10
			}
			if (!sequences) {
				score += 10
			}
		}

		doubles += Hand.getClearHandDoubles(hand)

		return score * (2**doubles)
	}

	static getClearHandDoubles(hand) {
		if (hand instanceof Hand) {hand = hand.contents}

		let suits = {}
		let honors = false
		let onesAndNines = true

		hand.forEach((item) => {
			if (item instanceof Sequence) {
				suits[item.tiles[0].type] = true
				onesAndNines = false
			}
			else {
				suits[item.type] = true
				if (item.value !== 1 && item.value !== 9) {
					onesAndNines = false
				}
			}
		})

		if (suits["wind"] || suits["dragon"]) {
			delete suits["wind"]
			delete suiuts["dragon"]
			honors = true
		}

		suits = Object.keys(suits).length
		if (suits === 0) {
			//All honors
			return 3
		}
		else if (suits === 1 && !honors) {
			return 3
		}
		else if (suits === 1 && honors) {
			return 1
		}
		else if (onesAndNines && !honors) {
			return 3
		}
		else if (onesAndNines && honors) {
			return 1
		}

		return 0
	}

	static isMahjong(hand, unlimitedSequences) {
		if (hand instanceof Hand) {hand = hand.contents}

		//Returns 2 for mahjong, and 0 for not mahjong.
		//If the hand is not currently committed to mahjong, but is mahjong, a hand containing the organization resulting in mahjong will be returned.
		let pongOrKong = 0
		let pairs = 0
		let sequences = 0

		let remainingTiles = []
		for (let i=0;i<hand.length;i++) {
			let match = hand[i]
			if (match.isPongOrKong) {pongOrKong++}
			else if (match.isPair) {pairs++}
			else if (match.isSequence) {sequences++}
			else {remainingTiles.push(match)}
		}

		if (pairs === 1) {
			if (unlimitedSequences) {
				if (sequences + pongOrKong === 4) {return 2}
			}
			else {
				if (Math.min(sequences, 1) + pongOrKong === 4) {return 2}
			}
		}

		//Now we need to go through our remaining tiles.
		console.log(pongOrKong, sequences, pairs)
		console.log(remainingTiles)
		let allTiles = Hand.sortTiles(Wall.getNonPrettyTiles(1))
		let possibleMatches = []
		let possibleSequences = []
		let testingHand = new Hand()
		testingHand.contents = remainingTiles.slice(0)

		allTiles.forEach((tile) => {
		    if (testingHand.removeTilesFromHand(tile, 3, true)) {
		    	possibleMatches.push(tile)
			}
		})

		allTiles.forEach((tile, index) => {
		    if (!Sequence.isValidSequence(allTiles.slice(index, index+3))) {
				return;
			}
			let sequence = new Sequence({
				exposed: false,
				tiles: allTiles.slice(index, index+3)
			})
		    if (testingHand.removeSequenceFromHand(sequence, true)) {
		    	possibleSequences.push(sequence)
			}
		})

		//https://stackoverflow.com/questions/5752002/find-all-possible-subset-combos-in-an-array/39092843#39092843
		function* generateCombinations(arr, size) {
		  function* doGenerateCombinations(offset, combo) {
		    if (combo.length == size) {
		      yield combo;
		    } else {
		      for (let i = offset; i < arr.length; i++) {
		        yield* doGenerateCombinations(i + 1, combo.concat(arr[i]));
		      }
		    }
		  }
		  yield* doGenerateCombinations(0, []);
		}

		let combinations = []
		let allPossibilities = possibleMatches
		let neededPongEquivs = 4

		if (unlimitedSequences || sequences === 0) {
			allPossibilities = allPossibilities.concat(possibleSequences)
			neededPongEquivs -= sequences
		}
		else {
			neededPongEquivs -= Math.min(sequences, 1)
		}
		neededPongEquivs -= pongOrKong

		for (let combo of generateCombinations(allPossibilities, neededPongEquivs)) {
  			combinations.push(combo);
		}

		console.log(possibleMatches)
		console.log(possibleSequences)
		console.log(combinations)

		let successfulCombinations = []
		combinations.forEach((combo, index) => {
			let localTestHand = new Hand()
			localTestHand.contents = testingHand.contents.slice(0)
			for (let i=0;i<combo.length;i++) {
				let item = combo[i]
				if (item instanceof Tile) {
					if (!localTestHand.removeTilesFromHand(item, 3)) {
						return 0
					}
					localTestHand.add(new Match({type: item.type, value: item.value, exposed: false, amount: 3}))
				}
				else if (item instanceof Sequence) {
					if (!localTestHand.removeSequenceFromHand(item)) {
						return 0
					}
					localTestHand.add(item)
				}
			}
			//Check for a pair
			let tile = (localTestHand.contents.filter((item) => {return item instanceof Tile}))[0]
			if (!localTestHand.removeTilesFromHand(tile, 2, true)) {
				return 0
			}
			else {
				localTestHand.add(new Match({type: tile.type, value: tile.value, exposed: false, amount: 2}))
				localTestHand.removeTilesFromHand(tile, 2)
				console.log(Hand.scoreHand(localTestHand, {isMahjong: true}))
				successfulCombinations.push(localTestHand)
				return true
			}
		})

		console.log(successfulCombinations)
		if (successfulCombinations.length > 1) {alert("You've created a hand that our code didn't know was possible. Everything may work fine, but please take a screenshot of your hand and open an issue at https://github.com/ecc521/mahjong. ")}
		if (successfulCombinations.length > 0) {return successfulCombinations[0]}
		return 0
	}

	static convertStringsToTiles(arr) {
		//arr is an array, with the stringified contents of the hand.
		let contents = arr.map((itemStr) => {
			let obj = JSON.parse(itemStr)
			if (obj.class === "Pretty") {
				return Pretty.fromJSON(itemStr)
			}
			else if (obj.class === "Tile") {
				return Tile.fromJSON(itemStr)
			}
			else if (obj.class === "Sequence") {
				return Sequence.fromJSON(itemStr)
			}
			else if (obj.class === "Match") {
				return Match.fromJSON(itemStr)
			}
			else {throw "Unable to identify itemString " + itemStr}
		})
		return contents
	}

	static fromString(str) {
		//Hand.fromString is only meant to be used on the server side. Therefore, it will not attempt to carry over any functionality that would be client side.
		let obj = JSON.parse(str)
		let wind = obj.wind

		let hand = new Hand({wind: obj.wind})
		hand.contents = Hand.convertStringsToTiles(obj.contents)
		return hand
	}
}

module.exports = Hand
