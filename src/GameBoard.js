const Tile = require("./Tile.js")
const Hand = require("./Hand.js")
const Wall = require("./Wall.js")
const Popups = require("./Popups.js")
const Sequence = require("./Sequence.js")
const Match = require("./Match.js")

let gameBoard = document.createElement("div")
gameBoard.id = "gameBoard"
document.body.appendChild(gameBoard)

function createTopOrBottomHand(handId) {
	let hand = document.createElement("div")
	hand.id = handId
	gameBoard.appendChild(hand)
	return hand
}

function createLeftOrRightHand(handId, containerId) {
	let hand = createTopOrBottomHand(handId)

	//We will return the container for the tiles. A container is used for the left and right hands in order to vertically center the tiles.
	let container = document.createElement("div")
	container.id = containerId
	hand.appendChild(container)

	return container
}

function Compass(config = {}) {
	config.id = config.id || "compass"

	this.compass = document.createElement("img")
	this.compass.id = config.id
	gameBoard.appendChild(this.compass)

	this.setDirectionForUserWind = function(userWind) {
		this.compass.src = "assets/compass-" + userWind + ".svg"
	}
}

let compass = new Compass({id: "compass"})

function FullscreenControls(elementId) {

	let goFullscreenImage = "assets/go-full-screen.svg"
	let exitFullscreenImage = "assets/exit-full-screen.svg"

	if (!document.fullscreenEnabled && document.webkitFullscreenEnabled) {
		//We'll add some support for the webkit prefix.
		Object.defineProperty(document, "fullscreenElement", {
			get: function() {return document.webkitFullscreenElement}
		})
		document.documentElement.requestFullscreen = function() {document.documentElement.webkitRequestFullScreen()}
		document.exitFullscreen = function() {document.webkitExitFullscreen()}
		document.addEventListener("webkitfullscreenchange", function() {
			document.dispatchEvent(new Event("fullscreenchange"))
		})
	}

	if (document.fullscreenElement !== undefined) {
		//Support check. This allows users to check toggleElement.
		this.toggleElement = document.createElement("img")
		this.toggleElement.id = elementId
		this.toggleElement.title = "Toggle Full Screen"
		this.toggleElement.addEventListener("click", function() {
			if (document.fullscreenElement) {
				document.exitFullscreen()
			}
			else {
				document.documentElement.requestFullscreen()
			}
		})

		let setIcon = (function setIcon() {
			if (document.fullscreenElement) {
				this.toggleElement.src = exitFullscreenImage
			}
			else {
				this.toggleElement.src = goFullscreenImage
			}
		}).bind(this)

		document.addEventListener("fullscreenchange", setIcon)
		setIcon()
	}
}

let fullscreenControls = new FullscreenControls("fullscreenControls")
if (fullscreenControls.toggleElement) {
	gameBoard.appendChild(fullscreenControls.toggleElement)
}

window.Tile = Tile
window.Sequence = require("./Sequence.js")
window.Match = require("./Match.js")


function createTilePlacemat() {
	let tilePlacemat = document.createElement("div")
	tilePlacemat.id = "tilePlacemat"
	return tilePlacemat
}

let tilePlacemat = createTilePlacemat()
gameBoard.appendChild(tilePlacemat)


let placeTilesButton = document.createElement("button")
placeTilesButton.id = "placeTilesButton"
placeTilesButton.innerHTML = "Place Tiles"
gameBoard.appendChild(placeTilesButton)

placeTilesButton.addEventListener("click", function() {
	let placement = userHand.inPlacemat
	console.log(placement)
	if (placement.length === 0) {
		new Popups.Notification("Place Nothing???", "We suggest glasses. ").show()
		return;
	}

	console.log(placement)
	window.stateManager.placeTiles(placement)
})

window.stateManager.onPlaceTiles = function(obj) {
	if (obj.status === "error") {
		new Popups.Notification("Error Placing Tiles", obj.message).show()
	}
}

window.stateManager.onWallEmpty = function(obj) {
	if (obj.status === "success") {
		new Popups.Notification("Game Over - Wall Empty", obj.message).show()
	}
}

window.stateManager.onGameplayAlert = function(obj) {
	console.log(obj.message)
	new Popups.BlocklessAlert(obj.message, 4000)
}

let nextTurnButton = document.createElement("button")
nextTurnButton.id = "nextTurnButton"
gameBoard.appendChild(nextTurnButton)

nextTurnButton.addEventListener("click", function() {
	window.stateManager.nextTurn()
})

let endGameButton = document.createElement("button")
endGameButton.id = "endGameButton"
endGameButton.innerHTML = "End Game"
gameBoard.appendChild(endGameButton)

endGameButton.addEventListener("click", function() {
	if (confirm("End the game?") && confirm("Are you absolutely sure you want to end the game? You will be blamed. ")) {
		window.stateManager.endGame()
	}
})

let goMahjongButton = document.createElement("button")
goMahjongButton.id = "goMahjongButton"
goMahjongButton.innerHTML = "Mahjong"
gameBoard.appendChild(goMahjongButton)

goMahjongButton.addEventListener("click", function() {
	let placement = userHand.inPlacemat
	console.log(placement)
	window.stateManager.placeTiles(placement, {mahjong: true})
})

stateManager.onGameMahjong = function(obj) {
	new Popups.Notification("Mahjong!", obj.message).show()
}

let wallRendering = document.createElement("div")
wallRendering.id = "wall"
gameBoard.appendChild(wallRendering)

let discardPile = document.createElement("div")
discardPile.id = "discardPile"
gameBoard.appendChild(discardPile)

function renderDiscardPile(tileStrings) {
	while (discardPile.firstChild) {discardPile.firstChild.remove()}

	let tiles = tileStrings.map((str) => {return Tile.fromJSON(str)})
	tiles = Hand.sortTiles(tiles)

	tiles.forEach((tile) => {
		let img = document.createElement("img")
		img.src = tile.imageUrl
		discardPile.appendChild(img)
	})
}


let userHandElem = createTopOrBottomHand("userHand")
let userHandElemExposed = createTopOrBottomHand("userHandExposed")
let userHand = new Hand({
	handToRender: userHandElem,
	handForExposed: userHandExposed,
	interactive: true,
	tilePlacemat: tilePlacemat
})
window.userHand = userHand

let rightHandContainer = createLeftOrRightHand("rightHand", "rightHandContainer")
let rightHand = new Hand({
	handToRender: rightHandContainer
})

let topHandElem = createTopOrBottomHand("topHand")
let topHand = new Hand({
	handToRender: topHandElem
})

let leftHandContainer = createLeftOrRightHand("leftHand", "leftHandContainer")
let leftHand = new Hand({
	handToRender: leftHandContainer
})

let nametagIds = ["bottomNametag", "rightNametag", "topNametag", "leftNametag"]
let nametags = nametagIds.map((id) => {
	let nametag = document.createElement("p")
	nametag.id = id
	gameBoard.appendChild(nametag)
	return nametag
})

window.stateManager.addEventListener("onStateUpdate", function(obj) {
	let message = obj.message

	if (!message.inGame) {return};

	if (message.wallTiles) {
		console.log(message.wallTiles)
		if (typeof message.wallTiles === "object") {
			message.wallTiles = message.wallTiles.map((str) => {return Tile.fromJSON(str)})
		}
		else {
			message.wallTiles = new Array(message.wallTiles).fill(new Tile({faceDown: true}))
		}
		console.log(message.wallTiles)
		Wall.renderWall(wallRendering, message.wallTiles)
	}

	if (message.discardPile) {
		renderDiscardPile(message.discardPile)
	}

	let clients = message.clients
	let winds = ["north", "east", "south", "west"]
	let hands = [userHand, rightHand, topHand, leftHand]

	let userWind;
	clients.forEach((client) => {
		if (client.hand) {
			console.log("User hand stuff")
			let tempHand = Hand.fromString(client.hand)
			//TODO: Currently, after refreshing the page during charleston, this results in the first 3 tiles stored on the server being put into the placemat, a very glitchy behavior.
			userHand.syncContents(tempHand.contents,  message?.currentTurn?.charleston)
			userWind = tempHand.wind
		}
	})

	let userWindIndex = winds.indexOf(userWind)

	compass.setDirectionForUserWind(userWind)
	let windOrder = winds.slice(userWindIndex).concat(winds.slice(0, userWindIndex))
	console.log(windOrder)
	console.log(hands)

	clients.forEach((client) => {
		let windPosition = 0;
		if (client.wind) {
			windPosition = windOrder.indexOf(client.wind)
		}
		let hand = hands[windPosition]

		if (client.visibleHand && client.wind) {
			console.log("Client hand stuff")
			console.log(client)
			console.log(client.wind)
			hand.syncContents(Hand.convertStringsToTiles(client.visibleHand))
			hand.wind = client.wind
		}

		let nametag = nametags[windPosition]
		nametag.innerHTML = client.nickname

		hand.handToRender.classList.remove("brightnessPulse")

		if (message.currentTurn && client.id === message.currentTurn.userTurn) {
			hand.handToRender.classList.add("brightnessPulse")
		}
	})

	hands.forEach((hand) => {hand.renderTiles()})
	if (message.currentTurn?.playersReady?.length > 0) {
		//The person has thrown their tile. Waiting on players to ready.
		nextTurnButton.innerHTML = "Next Turn (" + message.currentTurn.playersReady.length + "/4)"
		nextTurnButton.disabled = message.currentTurn.playersReady.includes(window.clientId)?"disabled":""
		placeTilesButton.disabled = message.currentTurn.playersReady.includes(window.clientId)?"disabled":""
		if (!message.currentTurn.thrown && message.currentTurn.userTurn === clientId) {placeTilesButton.disabled = ""}

		if (message.currentTurn.charleston) {
			nextTurnButton.disabled = "disabled"
		}

		if (message.currentTurn.userTurn !== clientId) {
			userHand.setEvictingThrownTile(Tile.fromJSON(message.currentTurn.thrown))
		}
		else {
			userHand.setEvictingThrownTile() //Clear evictingThrownTile
		}
		userHand.renderPlacemat()
	}
	else {
		nextTurnButton.disabled = "disabled"
		nextTurnButton.innerHTML = ""
		placeTilesButton.disabled = ""
		userHand.setEvictingThrownTile() //Clear evictingThrownTile
		//The person has not yet thrown a tile.
		if (message.currentTurn.userTurn === window.clientId) {
			userHand.renderPlacemat("pending")
		}
	}
})



module.exports = gameBoard
