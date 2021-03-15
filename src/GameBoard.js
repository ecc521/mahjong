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


let proceedButton = document.createElement("button")
proceedButton.id = "proceedButton"
proceedButton.innerHTML = "Proceed"
gameBoard.appendChild(proceedButton)

proceedButton.addEventListener("click", function() {

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

window.stateManager.onGameplayAlert = function(obj) {
	//Play sound.
	let sound = document.createElement("audio");

	let baseUrl = "assets/sounds/"
	let urls = [];
	if (obj.message.includes("thrown")) {
		sound.volume = 0.5
		//urls = ["tile-drop-table.mp3"]
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

let newGameNoLobbyButton = document.createElement("button")
newGameNoLobbyButton.id = "newGameNoLobbyButton"
newGameNoLobbyButton.innerHTML = "New Game"
gameBoard.appendChild(newGameNoLobbyButton)

let shouldConfirm = true
window.stateManager.addEventListener("onStartGame", function() {
	shouldConfirm = true
})

endGameButton.addEventListener("click", function() {
	//Require confirmation unless the game is over. Note that this might be slightly bugged with revert.
	if (
		!shouldConfirm
		|| confirm("Are you absolutely sure you want to end the game?")
	) {
		window.stateManager.endGame()
	}
})

newGameNoLobbyButton.addEventListener("click", function() {
	endGameButton.click()
	//Calling startGame when in a game does nothing, so it's fine to call it without guards.
	document.getElementById("startGameButton").click() //Clicks button on RoomManager - not currently visible.
})

function gameOver(message, obj) {
	shouldConfirm = false;
	new Popups.Notification(message, obj.message).show()
}

window.stateManager.onGameMahjong = function(obj) {
	gameOver("Mahjong!", obj)
}

window.stateManager.onWallEmpty = function(obj) {
	gameOver("Game Over - Wall Empty", obj)
}

let goMahjongButton = document.createElement("button")
goMahjongButton.id = "goMahjongButton"
goMahjongButton.innerHTML = "Mahjong"
gameBoard.appendChild(goMahjongButton)

goMahjongButton.addEventListener("click", function() {
	let placement = userHand.inPlacemat
	console.log(placement)
	window.stateManager.placeTiles(placement, {mahjong: true})
})

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
	if (window.stateManager.isHost) {
		newGameNoLobbyButton.style.display = ""
	}
	else {
		newGameNoLobbyButton.style.display = "none"
	}

	let message = obj.message

	if (!message.inGame) {
		document.body.style.overflow = ""
		return
	};
	document.body.style.overflow = "hidden"

	if (message.wallTiles !== undefined) {
		if (typeof message.wallTiles === "object") {
			message.wallTiles = Hand.convertStringsToTiles(message.wallTiles)
		}
		else {
			message.wallTiles = new Array(message.wallTiles).fill(new Tile({faceDown: true}))
		}
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

	hands.forEach((hand) => {hand.renderTiles(message?.currentTurn?.lastDrawn)}) //lastDrawn only affects unexposed tiles, so there isn't a problem passing it to all.
	if (message.currentTurn?.playersReady?.length > 0) {
		//The person has thrown their tile. Waiting on players to ready.
		proceedButton.disabled = message.currentTurn.playersReady.includes(window.clientId)?"disabled":""
		goMahjongButton.disabled = message.currentTurn.playersReady.includes(window.clientId)?"disabled":""
		proceedButton.innerHTML = "Proceed (" + message.currentTurn.playersReady.length + "/4)"
		//If you haven't thrown, are not in charleston, and it is your turn, override and enable.
		if (!message.currentTurn.thrown && !message.currentTurn.charleston && message.currentTurn.userTurn === clientId) {proceedButton.disabled = ""}
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
		userHand.renderPlacemat("")
	}
	else {
		proceedButton.disabled = ""
		goMahjongButton.disabled = ""
		proceedButton.innerHTML = "Proceed"
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
				proceedButton.disabled = "disabled"
				goMahjongButton.disabled = "disabled"
			}
		}
	}

	if (!proceedButton.disabled) {
		proceedButton.classList.add("scaleAnimation")
	}
	else {proceedButton.classList.remove("scaleAnimation")}
})

proceedButton.addEventListener("click", function() {
	//When clicked, remove proceed button scale animation.
	proceedButton.style.animation = "none"
	setTimeout(function() {
		proceedButton.style.animation = ""
	}, 100)
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
		proceedButton.click()
	}
	else if (Number(e.key) > 0 && Number(e.key) < 5) {
		//1,2,3, and 4 will correspond to the 4 placemat spots. Pressing them will remove the specified tile.
		let pos = Number(e.key) - 1
		userHand.moveTile(userHand.inPlacemat[pos])
	}
	else if (chars.includes(e.key.toLowerCase())) {
		let index = chars.indexOf(e.key.toLowerCase())
		let tiles = userHand.contents.filter((item) => {return item instanceof Tile})
		userHand.moveTile(tiles[index])
	}
})

function handleScreenResize() {
	topHand.renderTiles()
	leftHand.renderTiles()
	rightHand.renderTiles()
	userHand.renderTiles()
}
window.addEventListener("resize", handleScreenResize)
window.addEventListener("orientationchange", handleScreenResize)

window.addEventListener("scroll", function(event) {
	if (window.stateManager.inGame) {
		window.scrollTo(0,0)
	}
})


module.exports = gameBoard
