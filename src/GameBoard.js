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
compass.setDirectionForUserWind("east")


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


/*
let wallRendering = document.createElement("div")
Wall.renderWall(wallRendering, 91)
wallRendering.id = "wall"
gameBoard.appendChild(wallRendering)


let handTiles = tiles.slice(-14)

let userHandElem = createTopOrBottomHand("userHand")
let userHandElemExposed = createTopOrBottomHand("userHandExposed")
let userHand = new Hand({
	handToRender: userHandElem,
	handForExposed: userHandExposed,
	interactive: true,
	tilePlacemat: tilePlacemat
})
console.log(userHand)

window.userHand = userHand

//userHand.sortTiles(handTiles)
handTiles.forEach((value) => {
	userHand.add(value)
})
userHand.renderTiles()



let leftHandTiles = tiles.slice(-28, -14)
let leftHandContainer = createLeftOrRightHand("leftHand", "leftHandContainer")

let leftHand = new Hand({
	handToRender: leftHandContainer
})

leftHandTiles.forEach((value) => {leftHand.add(value)})
leftHand.renderTiles()


let rightHandTiles = tiles.slice(-42, -28)


let rightHandContainer = createLeftOrRightHand("rightHand", "rightHandContainer")

function drawRightTile(tile) {
	let elem = document.createElement("img")
	elem.src = tile.imageUrl
	rightHandContainer.appendChild(elem)
}

for (let i=0;i<rightHandTiles.length;i++) {
	let rightHandTile = rightHandTiles[i]
	drawRightTile(rightHandTile)
}




let topHandTiles = tiles.slice(-56, -42)


let topHand = createTopOrBottomHand("topHand")


function drawTopTile(tile) {
	let elem = document.createElement("img")
	elem.src = tile.imageUrl
	topHand.appendChild(elem)
}

for (let i=0;i<topHandTiles.length;i++) {
	let topHandTile = topHandTiles[i]
	//drawTopTile(topHandTile)
	drawTopTile(new Tile({faceDown: true}))
}









*/

















//For testing.

let tiles = new (require("./Wall.js"))().tiles
console.log(tiles)

let wallRendering = document.createElement("div")
window.wallRendering = wallRendering
window.Wall = require("./Wall.js")
Wall.renderWall(wallRendering, 91)
wallRendering.id = "wall"
gameBoard.appendChild(wallRendering)


let handTiles = tiles.slice(-14)

let userHandElem = createTopOrBottomHand("userHand")
let userHandElemExposed = createTopOrBottomHand("userHandExposed")
let userHand = new Hand({
	handToRender: userHandElem,
	handForExposed: userHandExposed,
	interactive: true,
	tilePlacemat: tilePlacemat
})
console.log(userHand)

window.userHand = userHand

//userHand.sortTiles(handTiles)
handTiles.forEach((value) => {
	userHand.add(value)
})
userHand.renderTiles()



let leftHandTiles = tiles.slice(-28, -14)
let leftHandContainer = createLeftOrRightHand("leftHand", "leftHandContainer")

let leftHand = new Hand({
	handToRender: leftHandContainer
})

leftHandTiles.forEach((value) => {leftHand.add(value)})
leftHand.renderTiles()


let rightHandTiles = tiles.slice(-42, -28)


let rightHandContainer = createLeftOrRightHand("rightHand", "rightHandContainer")

function drawRightTile(tile) {
	let elem = document.createElement("img")
	elem.src = tile.imageUrl
	rightHandContainer.appendChild(elem)
}

for (let i=0;i<rightHandTiles.length;i++) {
	let rightHandTile = rightHandTiles[i]
	drawRightTile(rightHandTile)
}




let topHandTiles = tiles.slice(-56, -42)


let topHand = createTopOrBottomHand("topHand")


function drawTopTile(tile) {
	let elem = document.createElement("img")
	elem.src = tile.imageUrl
	topHand.appendChild(elem)
}

for (let i=0;i<topHandTiles.length;i++) {
	let topHandTile = topHandTiles[i]
	//drawTopTile(topHandTile)
	drawTopTile(new Tile({faceDown: true}))
}

module.exports = gameBoard
