const Tile = require("./Tile.js")
const Match = require("./Match.js")
const Sequence = require("./Sequence.js")
const Pretty = require("./Pretty.js")
const Wall = require("./Wall.js")

class Hand {
	constructor(config = {}) {
		//handForExposed - Optional. If exposed tiles should be placed in a seperate hand, they will be placed here.
		//interactive: Can the user drag and drop to reorder? Click to swap between hand and placemat?
		//tilePlacemat: Element that will allow user to select tiles to expose.
		this.handToRender = config.handToRender
		this.handForExposed = config.handForExposed
		this.tilePlacemat = config.tilePlacemat
		this.interactive = config.interactive || false
		this.wind = config.wind

		//We will also have one events: this.onPlacematChange

		this.contents = [] //Contents of hand.
		this.inPlacemat = [] //Additional contents of hand. In placemat.

		this.syncContents = (require("./Hand/syncContents.js")).bind(this)
		this.score = (require("./Hand/score.js")).bind(this)
		this.getClearHandDoubles = (require("./Hand/getClearHandDoubles.js")).bind(this)
		this.isMahjong = (require("./Hand/isMahjong.js")).bind(this)
		this.isCalling = (require("./Hand/isCalling.js")).bind(this)


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
			let index = this.contents.indexOf(obj)
			let placematIndex = this.inPlacemat.indexOf(obj)
			if (index !== -1) {
				this.contents.splice(index, 1)
			}
			else if (placematIndex !== -1) {
				this.inPlacemat.splice(placematIndex, 1)
			}
			else {throw obj + " does not exist in hand. "}
		}).bind(this)


		this.moveTile = (function moveTile(tile, switchPlace = true, targetPosition) {
			//Tile is the object in either the hand or placemat.

			let placematIndex = this.inPlacemat.indexOf(tile)
			let contentsIndex = this.contents.indexOf(tile)

			console.log(targetPosition)

			if (placematIndex + contentsIndex === -2) {
				console.error("Tile does not exist. ")
				return
			}

			let target = [this.inPlacemat, this.contents];
			if (switchPlace) {
				if (placematIndex === -1) {
					//Moving from hand to placemat.
					if (this.inPlacemat.length >= 4) {
						alert("Placemat is already full. ")
						return
					}
					else {
						this.inPlacemat.push(this.contents.splice(contentsIndex, 1)[0])
					}
				}
				else {
					//Moving from placemat to hand.
					if (placematIndex === 0 && this.inPlacemat[0].evicting) {
						alert("This tile was discarded. To claim it, select the tiles you would like to match with it, then hit proceed. ")
						return;
					}
					let currentTile = this.inPlacemat.splice(placematIndex, 1)[0]
					if (!isNaN(targetPosition)) {
						//Moving to specfic place in hand.
						this.contents.splice(targetPosition, 0, currentTile)
					}
					else {
						//Add with auto sort.
						this.add(currentTile)
					}
				}
			}
			else if (!isNaN(targetPosition)){
				if (contentsIndex === -1) {
					console.error("Reordering in placemat is not supported. Must be in hand.")
				}
				else {
					console.log(contentsIndex)
					console.log(targetPosition)

					let newTargetPosition = targetPosition
					if (targetPosition > contentsIndex) {targetPosition--}

					console.log(targetPosition)

					this.contents.splice(targetPosition, 0, this.contents.splice(contentsIndex, 1)[0])
				}
			}
			else {console.error("Unable to determine how this tile should be moved. ")}

			this.renderTiles() //Re-render.
			this.renderPlacemat() //Not sure if this is needed?
		}).bind(this)

		this.removeMatchingTile = (function(obj) {
			//Removes a Tile that matches the object passed, although may not be the same objet.
			if (!obj instanceof Tile) {throw "removeMatchingTile only supports Tiles"}
			if (this.inPlacemat.length > 0) {console.warn("Hand.removeMatchingTile is intended for server side use only. ")}
			if (this.contents.some(((item, index) => {
				if (obj.matches(item)) {
					this.contents.splice(index, 1)
					return true
				}
				return false
			}).bind(this))) {return true}
			return false
		})

		this.getExposedTiles = (function(includeFaceDown = false) {
			let exposedTiles = []
			this.contents.forEach((item) => {
				if (item.exposed) {
					exposedTiles.push(item)
				}
				else if (item instanceof Match && item.amount === 4) {
					//If it is stored as a match, but not exposed, is in hand kong.
					//Is not stored as a match if the user never placed them down
					exposedTiles.push(item)
				}
				else if (includeFaceDown) {
					exposedTiles.push(new Tile({faceDown: true}))
				}
			})
			return exposedTiles
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

			let targetIndex = 0
			for (let i=0;i<this.handToRender.children.length;i++) {
				let child = this.handToRender.children[i]
				let bounds = child.getBoundingClientRect()

				targetIndex++

				if (ev.x < bounds.left + bounds.width / 2) {
					//This child is to the left of the drop point.
					targetIndex-- //Should not be at the very end.
					break;
				}
			}

			if (elem.placematIndex !== undefined) {
				//We are dragging out of the placemat, into the hand.
				this.moveTile(this.inPlacemat[elem.placematIndex], true, targetIndex)
			}
			else {
				//Reordering hand.
				this.moveTile(this.contents[elem.tileIndex], false, targetIndex)
			}
		}).bind(this)

		let dropOnPlacemat = (function dropOnPlacemat(ev) {
			ev.preventDefault();
			let randomClass = ev.dataTransfer.getData("randomClass");
			let elem = document.getElementsByClassName(randomClass)[0]
			elem.classList.remove(randomClass)

			this.moveTile(this.contents[elem.tileIndex])
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


		this.removeMatchingTilesFromHand = (function removeMatchingTilesFromHand(obj, amount = 1, simulated = false) {
			if (!obj instanceof Tile) {throw "You must send a tile. "}
			return this.removeTilesFromHand(new Array(amount).fill(obj), simulated)
		}).bind(this)

		this.removeTilesFromHand = (function removeTilesFromHand(tiles, simulated = false) {
			if (tiles instanceof Sequence) {tiles = tiles.tiles}
			if (tiles instanceof Tile) {tiles = [tiles]}
			else if (!tiles instanceof Array) {throw "Must send a Sequence, Tile, or Array. "}

			//We will verify that the tiles CAN be removed before removing them.
			let indexes = []
			tiles.forEach((tile, index) => {
				if (!(tile instanceof Tile)) {throw "Your Sequence or Array contains non-tiles. "}
				for (let i=this.contents.length-1;i>=0;i--) {
					if (tile.matches(this.contents[i]) && !indexes.includes(i)) {
						indexes[index] = i
						return
					}
				}
			})

			let allDefined = true
			for (let i=0;i<tiles.length;i++) {
				if (indexes[i] === undefined) {
					allDefined = false
				}
			}
			if (allDefined) {
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
			classForFirst = classForFirst ?? this.tilePlacemat.firstChild?.className //Don't clear existing class unless classForFirst is ""
			while (this.tilePlacemat.firstChild) {this.tilePlacemat.firstChild.remove()} //Delete everything currently rendered in the hand.

			for (let i=0;i<4;i++) {
				let tile = this.inPlacemat[i]
				let elem = document.createElement("img")
				if (i === 0 && classForFirst) {
					elem.className = classForFirst
				}
				if (tile) {
					elem.src = tile.imageUrl
					elem.title = tile.tileName
					elem.draggable = true //Is this even neccessary? It wasn't set earlier, yet it was working fine. Do browsers just assume or something?
					//Both work. Using i is faster and simpler.
					elem.placematIndex = i //this.inPlacemat.findIndex((item) => {return item === tile})
					elem.addEventListener("dragstart", dragstart)
					elem.addEventListener("click", (function() {
						this.moveTile(tile) //Closure.
					}).bind(this))
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

		this.renderTiles = (function(displayElevated) {
			if (!this.handToRender) {throw "Unable to render hand. You must pass config.handToRender to the constructor. "}

			while (this.handToRender.firstChild) {this.handToRender.firstChild.remove()} //Delete everything currently rendered in the hand.
			if (this.handForExposed) {
				while (this.handForExposed.firstChild) {this.handForExposed.firstChild.remove()} //Delete everything currently rendered in the hand.
			}

			if (typeof displayElevated === "string") {displayElevated = Tile.fromJSON(displayElevated)}

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
							items[0].faceDown = true
							items[0] = Tile.fromJSON(items[0].toJSON()) //Regenerate tile. This fixes the image url and name.
						}
					}
					if (item.exposed) {
						exposedTiles = exposedTiles.concat(items)
					}
					else {
						if (item instanceof Match && item.amount === 4) {
							//In hand kong. Expose with 2 flipped tiles. (One already flipped)
							items[3].faceDown = true
							items[3] = Tile.fromJSON(items[3].toJSON()) //Regenerate tile. This fixes the image url and name.
							exposedTiles = exposedTiles.concat(items)
						}
						else {
							console.log(items)
							unexposedTiles = unexposedTiles.concat(items)
						}
					}
				}
				else {console.error("Unknown item " + item)}
			}

			let drawTiles = (function drawTiles(tiles, type, applyColorShading = false) {
				for (let i=0;i<tiles.length;i++) {
					let tile = tiles[i]
					let elem = document.createElement("img")
					elem.src = tile.imageUrl
					elem.title = tile.tileName

					if (type === "exposed" && this.handForExposed) {
						this.handForExposed.appendChild(elem)
					}
					else if (type === "exposed") {
						if (applyColorShading) {
							//There is no hand specifically for exposed tiles. We'll apply some style to make it clear this was exposed.
							elem.style.filter = "brightness(1.2)"
						}
						this.handToRender.appendChild(elem)
					}
					else if (type === "unexposed"){
						if (!this.handForExposed && applyColorShading) {
							//There is no hand for exposed tiles, let's make it clear this is unexposed
							elem.style.filter = "brightness(0.8)"
						}
						if (this.interactive) {
							if (displayElevated && tile.matches(displayElevated)) {
								displayElevated = undefined
								elem.classList.add("animateTile")
							}
							elem.draggable = true
							elem.addEventListener("click", (function() {
								this.moveTile(tile) //Closure.
							}).bind(this))
							elem.addEventListener("dragstart", dragstart)
							elem.tileIndex = this.contents.findIndex((item) => {return item === tile})
						}
						this.handToRender.appendChild(elem)
					}
				}

				//Note: If the window is resized, tiles will not adjust until the hand is redrawn.
				function resizeHandTiles(hand) {
					if (hand.children.length > 14) {
						//Downscale tiles to fit.
						let baseVh = parseFloat(document.documentElement.style.getPropertyValue("--vh")) //Pixels.
						baseVh /= hand.children.length / 14
						let baseVw = parseFloat(document.documentElement.style.getPropertyValue("--vw")) //Pixels.
						baseVw /= hand.children.length / 14

						hand.children.forEach((child) => {
							child.style.setProperty("--vh", baseVh + "px")
							child.style.setProperty("--vw", baseVw + "px")
						})
					}
				}

				resizeHandTiles(this.handToRender)
				if (this.handForExposed) {resizeHandTiles(this.handForExposed)}
			}).bind(this)

			console.log(exposedTiles)
			console.log(unexposedTiles)
			let applyColorShading = false
			//If there are any tiles in unexposedTiles that are not face down, or there are no unexposed tiles.
			if (unexposedTiles.some((tile) => {return !(tile.faceDown)}) || unexposedTiles.length === 0) {
				applyColorShading = true
			}
			drawTiles(exposedTiles, "exposed", applyColorShading)
			drawTiles(unexposedTiles, "unexposed", applyColorShading)
			if (this.tilePlacemat) {
				this.renderPlacemat()
			}
		}).bind(this)

		this.getStringContents = (function(prop = "contents") {
			//Can also pass "inPlacemat" for placemat contents.
			return this[prop].map((item) => {return item.toJSON()})
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
