const Tile = require("./Tile.js")
const Hand = require("./Hand.js")
const Wall = require("./Wall.js")

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
	let hands = [userHand, rightHand, topHand, leftHand]

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
})



module.exports = gameBoard
