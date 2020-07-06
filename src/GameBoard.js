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
		//There are four compasses - compass-north, compass-south, etc. They specify which direction is at the top of the compass, or for the hand across from the users.
		//Convert userWind to the direction for the compass.
		let translations = {
			"north": "south",
			"east": "west",
			"south": "north",
			"west": "east"
		}
		this.compass.src = "assets/compass-" + translations[userWind] + ".svg"
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

	//Now we need to create a Sequence, Match, or just Tile
	if (placement.length > 1) {
		try {
			let sequence = new Sequence({exposed: true, tiles: placement})
			placement = sequence
		}
		catch (e) {
			if (Match.isValidMatch(placement)) {
				placement = new Match({exposed: true, amount: placement.length, type: placement[0].type, value: placement[0].value})
			}
			else {
				new Popups.Notification("Placement Error", "Unable to create a sequence, or match. Please check your tiles. ").show()
				return;
			}
		}
	}

	console.log(placement)
	window.stateManager.placeTiles(placement)
})

window.stateManager.onPlaceTiles = function(obj) {
	if (obj.status === "error") {
		new Popups.Notification("Error Placing Tiles", obj.message).show()
	}
}


let nextTurnButton = document.createElement("button")
nextTurnButton.id = "nextTurnButton"
gameBoard.appendChild(nextTurnButton)

nextTurnButton.addEventListener("click", function() {

})

let wallRendering = document.createElement("div")
wallRendering.id = "wall"
gameBoard.appendChild(wallRendering)


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


window.stateManager.addEventListener("onStateUpdate", function(obj) {
	let message = obj.message

	if (!message.inGame) {return};

	if (message.wallTiles) {
		Wall.renderWall(wallRendering, message.wallTiles)
	}

	let clients = message.clients
	let winds = ["north", "east", "south", "west"]
	let hands = [userHand, leftHand, topHand, rightHand]

	let userWind;
	clients.forEach((client) => {
		if (client.hand) {
			console.log("User hand stuff")
			let tempHand = Hand.fromString(client.hand)
			userHand.syncContents(tempHand.contents)
			userWind = tempHand.wind
		}
	})

	let userWindIndex = winds.indexOf(userWind)

	compass.setDirectionForUserWind(userWind)
	let windOrder = winds.slice(userWindIndex).concat(winds.slice(0, userWindIndex))
	console.log(windOrder)
	console.log(hands)

	clients.forEach((client) => {
		if (client.visibleHand && client.wind) {
			console.log("Client hand stuff")
			console.log(client)
			console.log(client.wind)
			let hand = hands[windOrder.indexOf(client.wind)]
			hand.syncContents(Hand.convertStringsToTiles(client.visibleHand))
			hand.wind = client.wind
		}
	})

	hands.forEach((hand) => {hand.renderTiles()})

	userHand.renderPlacemat()
	if (message.currentTurn && message.currentTurn.thrown) {
		//The person has thrown their tile. Waiting on players to ready.
		nextTurnButton.innerHTML = "Next Turn (" + message.currentTurn.playersReady + "/4)"
		nextTurnButton.disabled = message.currentTurn.usersReady.includes(window.clientId)?"disabled":""
	}
	else {
		nextTurnButton.disabled = "disabled"
		//The person has not yet thrown a tile.
		if (message.currentTurn.userTurn === window.clientId) {
			userHand.renderPlacemat("pending")
		}
	}
})



module.exports = gameBoard
