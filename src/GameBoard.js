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


let revertStateButton = document.createElement("button")
revertStateButton.id = "revertStateButton"
revertStateButton.innerHTML = "Revert"
gameBoard.appendChild(revertStateButton)

revertStateButton.addEventListener("click", function() {
	let res = prompt("How many moves (4 moves per turn) would you like to revert? You can always revert more if needed, but can't undo a revert. ")
	if (res !== null && confirm("Are you sure you would like to revert the game state? Other players will be notified, so you should clear the revert with them. ")) {
		window.stateManager.revertState(res)
	}
})


let placeTilesButton = document.createElement("button")
placeTilesButton.id = "placeTilesButton"
placeTilesButton.innerHTML = "Proceed"
gameBoard.appendChild(placeTilesButton)

placeTilesButton.addEventListener("click", function() {

	let placement = userHand.inPlacemat

	//If the user has 0 tiles in placemat, or 1 tile, which is the thrown one, next turn.
	if (placement.length === Number(placement.some((obj) => {return obj.evicting}))) {
		window.stateManager.placeTiles([])
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
	//Play sound.
	let sound = document.createElement("audio");

	let baseUrl = "assets/sounds/"
	let urls = [];
	if (obj.message.includes("thrown")) {
		sound.volume = 0.5
		urls = ["tile-drop-table.mp3"]
	}
	else if (obj.message.includes("mahjong")) {
		sound.volume = 1.2
		urls = ["tiles-dropping-table.mp3"]
	}

	if (urls.length > 0) {
		sound.src = baseUrl + urls[Math.floor(Math.random() * urls.length)];
		sound.setAttribute("preload", "auto");
		sound.setAttribute("controls", "none");
		sound.style.display = "none";
		document.body.appendChild(sound);
		sound.play()
		setTimeout(function() {
			sound.remove()
		}, 2000)
	}


	console.log(obj)
	console.log(obj.message)
	let alert = new Popups.BlocklessAlert(obj.message, 4000 * (obj?.status?.durationMultiplier || 1))
	console.log(alert)
	alert.onStart.then(() => {
		if (window.voiceChoices[obj?.status?.clientId] && obj?.status?.speech) {
			//TODO: SPEAK!!!
			let utterance = new SpeechSynthesisUtterance(obj.status.speech)
			let voice = window.voiceChoices[obj.status.clientId].get()
			console.log(window.voiceChoices[obj.status.clientId])
			console.log(window.voiceChoices[obj.status.clientId].get())
			console.log(voice)
			if (typeof voice !== "string") {
				try {
					utterance.voice = voice
				}
				catch(e) {console.error(e)}
			}
			if (voice !== "none") {
				speechSynthesis.speak(utterance)
			}
		}
	})
}


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
		img.title = tile.tileName
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

	if (!message.inGame) {
		document.body.style.overflow = ""
		return
	};
	document.body.style.overflow = "hidden"

	if (message.wallTiles !== undefined) {
		console.log(message.wallTiles)
		if (typeof message.wallTiles === "object") {
			message.wallTiles = Hand.convertStringsToTiles(message.wallTiles)
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
		nametag.style.color = ""

		hand.handToRender.classList.remove("brightnessPulse")

		if (message.currentTurn && client.id === message.currentTurn.userTurn) {
			hand.handToRender.classList.add("brightnessPulse")
			nametag.style.color = "red"
		}
	})

	hands.forEach((hand) => {hand.renderTiles()})
	if (message.currentTurn?.playersReady?.length > 0) {
		//The person has thrown their tile. Waiting on players to ready.
		placeTilesButton.disabled = message.currentTurn.playersReady.includes(window.clientId)?"disabled":""
		goMahjongButton.disabled = message.currentTurn.playersReady.includes(window.clientId)?"disabled":""
		placeTilesButton.innerHTML = "Proceed (" + message.currentTurn.playersReady.length + "/4)"
		//If you haven't thrown, are not in charleston, and it is your turn, override and enable.
		if (!message.currentTurn.thrown && !message.currentTurn.charleston && message.currentTurn.userTurn === clientId) {placeTilesButton.disabled = ""}
		if (message.currentTurn.charleston && message.currentTurn.userTurn !== clientId) {
			//You have 13 tiles. Mahjong impossible.
			goMahjongButton.disabled = "disabled"
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
		placeTilesButton.disabled = ""
		goMahjongButton.disabled = ""
		placeTilesButton.innerHTML = "Proceed"
		userHand.setEvictingThrownTile() //Clear evictingThrownTile
		//The person has not yet thrown a tile.

		if (message.currentTurn.charleston) {
			//TODO: Not sure if East wind is allowed to go Mahjong during a charleston. As of now, Room.js will treat mahjong just like place tiles during charleston,
			//so we'll disable the option
			goMahjongButton.disabled = "disabled"
		}

		if (message.currentTurn.userTurn === window.clientId) {
			userHand.renderPlacemat("pending")
		}
		else {
			if (!message.currentTurn.charleston) {
				placeTilesButton.disabled = "disabled"
				goMahjongButton.disabled = "disabled"
			}
		}
	}
})

//Add hotkeys
document.addEventListener("keyup", function(e) {
	let chars = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f"] //qwertyuiopasdf will correspond to first 14 hand spots. Pressing will move to placemat.
	if (!stateManager.inGame) {
		return;
	}
	if (e.code === "Space" && e.shiftKey) {
		goMahjongButton.click()
	}
	else if (e.code === "Space") {
		placeTilesButton.click()
	}
	else if (Number(e.key) > 0 && Number(e.key) < 5) {
		//1,2,3, and 4 will correspond to the 4 placemat spots. Pressing them will remove the specified tile.
		let pos = Number(e.key) - 1
		if (userHand.inPlacemat[pos] && !userHand.inPlacemat[pos].evicting) {
			//Hotkeys will not throw errors. They will silently fail if invalid.
			userHand.add(userHand.inPlacemat.splice(pos, 1)[0])
			userHand.renderPlacemat()
			userHand.renderTiles()
		}
	}
	else if (chars.includes(e.key.toLowerCase())) {
		let tiles = userHand.contents.filter((item) => {return item instanceof Tile})
		let index = chars.indexOf(e.key.toLowerCase())
		if (userHand.inPlacemat.length < 4 && tiles[index]) {
			userHand.inPlacemat.push(
				userHand.contents.splice(
					userHand.contents.indexOf(tiles[index]), 1)[0])
			userHand.renderPlacemat()
			userHand.renderTiles()
		}
	}
})

window.addEventListener("resize", function() {
	topHand.renderTiles()
	leftHand.renderTiles()
	rightHand.renderTiles()
	userHand.renderTiles()
})

window.addEventListener("scroll", function(event) {
	if (window.stateManager.inGame) {
		window.scrollTo(0,0)
	}
})


module.exports = gameBoard
