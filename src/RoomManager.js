const Popups = require("./Popups.js")
const SettingsMenu = require("./RoomManager/SettingsMenu.js")

const QRCode = require("qrcode-generator")

//Allow the user to join and create rooms.
let roomManager = document.createElement("div")
roomManager.id = "roomManager"
document.body.appendChild(roomManager)


//In order to get the "4 friends" part styled differently, we will need 3 elements for our heading.
let heading = document.createElement("div")
heading.id = "heading"
roomManager.appendChild(heading)

let mahjongHeading = document.createElement("h1")
mahjongHeading.innerHTML = "Mahjong"
mahjongHeading.id = "mahjongHeading"
heading.appendChild(mahjongHeading)

let fourFriendsHeading = document.createElement("h1")
fourFriendsHeading.innerHTML = "4 Friends"
fourFriendsHeading.id = "fourFriendsHeading"
heading.appendChild(fourFriendsHeading)

//notInRoomContainer: The stuff to create or join a room.
let notInRoomContainer = document.createElement("div")
notInRoomContainer.id = "notInRoomContainer"
roomManager.appendChild(notInRoomContainer)

let roomIdInput = document.createElement("input")
roomIdInput.id = "roomIdInput"
roomIdInput.placeholder = "Enter Room Name..."
notInRoomContainer.appendChild(roomIdInput)

//Put the nickname input on a new line.
notInRoomContainer.appendChild(document.createElement("br"))

let nicknameInput = document.createElement("input")
nicknameInput.id = "nicknameInput"
nicknameInput.placeholder = "Choose a Nickname..."
notInRoomContainer.appendChild(nicknameInput)

//The join/create room buttons.
let joinOrCreateRoom = document.createElement("div")
joinOrCreateRoom.id = "joinOrCreateRoom"
notInRoomContainer.appendChild(joinOrCreateRoom)

const nameWarningCharAmount = 11 //Warn users about names over 11 characters

let joinRoom = document.createElement("button")
joinRoom.id = "joinRoom"
joinRoom.innerHTML = "Join Room"
joinRoom.addEventListener("click", function() {
	if (roomIdInput.value.trim().length === 0) {
		return new Popups.Notification("Room Name Invalid", "The room name contains at least one character. Please enter it into the box labeled \"Enter Room Name\" ").show()
	}
	if (nicknameInput.value.length > nameWarningCharAmount
		&& !confirm("Long names may cause visual display problems. Proceed?")
	) {return}
	window.stateManager.joinRoom(roomIdInput.value.toLowerCase(), nicknameInput.value)
})
joinOrCreateRoom.appendChild(joinRoom)

let createRoom = document.createElement("button")
createRoom.id = "createRoom"
createRoom.innerHTML = "Create Room"
createRoom.addEventListener("click", function() {
	if (roomIdInput.value.trim().length === 0) {
		return new Popups.Notification("Unable to Create Room", "Please pick a 1+ character long name, and enter it into the box labeled \"Enter Room Name\" ").show()
	}
	if (nicknameInput.value.length > nameWarningCharAmount
		&& !confirm("Long names may cause visual display problems. Proceed?")
	) {return}
	window.stateManager.createRoom(roomIdInput.value.toLowerCase(), nicknameInput.value)
})
joinOrCreateRoom.appendChild(createRoom)

joinOrCreateRoom.appendChild(document.createElement("br"))
let singlePlayerGame = document.createElement("button")
singlePlayerGame.id = "singlePlayerGame"
singlePlayerGame.innerHTML = "Single Player"
singlePlayerGame.addEventListener("click", function() {
	let roomId = roomIdInput.value.trim() || ("sp-" + Math.floor(Math.random() * 1e10)) //We need to stop depending on randomness - collisions are possible.
	//Websockets guarantees delivery order, so we should be safe here, unless any calls error.

	let nickname = nicknameInput.value || "Player 1"
	if (nickname.length > nameWarningCharAmount
		&& !confirm("Long names may cause visual display problems. Proceed?")
	) {return}

	window.stateManager.createRoom(roomId, nickname)
	window.stateManager.addBot("Bot 1")
	window.stateManager.addBot("Bot 2")
	window.stateManager.addBot("Bot 3")
})
joinOrCreateRoom.appendChild(singlePlayerGame)


//Inform user to use landscape.
if (window.isNative) {
    try {
        window.screen.orientation.lock('landscape');
    }
    catch (e) {console.error(e)}
}

let screenRotationAlert = document.createElement("p")
screenRotationAlert.id = "screenRotationAlert"
screenRotationAlert.innerHTML = "Rotating your screen to Landscape mode is recommended. "
notInRoomContainer.appendChild(screenRotationAlert)

function setScreenRotationAlert(event) {
	let orientation = window.screen?.orientation?.type
	//Window.innerWidth is returning the wrong value in simulator. May not be an issue on actual devices, but screen.width works fine.
	if (
		(orientation?orientation.includes("portrait"):(Math.abs(window.orientation) !== 90)) //Support iOS window.orientation
		&& screen.width < 900) {
		screenRotationAlert.style.display = ""
	}
	else {
		screenRotationAlert.style.display = "none"
	}
}
window.addEventListener("orientationchange", setScreenRotationAlert);
setScreenRotationAlert()

let inRoomContainer = document.createElement("div")
inRoomContainer.id = "inRoomContainer"
inRoomContainer.style.display = "none"
roomManager.appendChild(inRoomContainer)

let currentRoom = document.createElement("h2")
currentRoom.id = "currentRoom"
inRoomContainer.appendChild(currentRoom)

let playerCount = document.createElement("h2")
playerCount.id = "playerCount"
inRoomContainer.appendChild(playerCount)

let playerView = document.createElement("div")
playerView.id = "playerView"
inRoomContainer.appendChild(playerView)


let leaveRoomButton = document.createElement("button")
leaveRoomButton.innerHTML = "Leave Room"
leaveRoomButton.id = "leaveRoomButton"
inRoomContainer.appendChild(leaveRoomButton)

leaveRoomButton.addEventListener("click", function() {
	if (confirm("Are you sure you want to leave this room?")) {
		window.stateManager.leaveRoom(window.stateManager.roomId)
	}
})


let closeRoomButton = document.createElement("button")
closeRoomButton.innerHTML = "Close Room"
closeRoomButton.id = "closeRoomButton"
closeRoomButton.style.display = "none"
inRoomContainer.appendChild(closeRoomButton)

closeRoomButton.addEventListener("click", function() {
	if (confirm("Are you sure you want to close this room?")) {
		window.stateManager.closeRoom(window.stateManager.roomId)
	}
})

let startGameButton = document.createElement("button")
startGameButton.innerHTML = "Start Game"
startGameButton.id = "startGameButton"
startGameButton.style.display = "none"
inRoomContainer.appendChild(startGameButton)

let gameSettings;
startGameButton.addEventListener("click", function() {
	window.stateManager.startGame(gameSettings.getChoices())
})

let addBotButton = document.createElement("button")
addBotButton.innerHTML = "Add Bot"
addBotButton.id = "addBotButton"
addBotButton.style.display = "none"
inRoomContainer.appendChild(addBotButton)

addBotButton.addEventListener("click", function() {
	let name = prompt("Please enter a name for the bot: ")
	if (name.length > nameWarningCharAmount && !confirm("Long names may cause visual display problems. Proceed?")) {return}
	window.stateManager.addBot(name)
})


let inviteYourFriendsElem = document.createElement("div")
inviteYourFriendsElem.id = "inviteYourFriendsElem"
inRoomContainer.appendChild(inviteYourFriendsElem)

let inviteYourFriendsDiv = document.createElement("div")
inviteYourFriendsDiv.id = "inviteYourFriendsDiv"
inviteYourFriendsElem.appendChild(inviteYourFriendsDiv)

let inviteYourFriendsHeader = document.createElement("h2")
inviteYourFriendsHeader.innerHTML = "Invite Players to Join This Game!"
inviteYourFriendsDiv.appendChild(inviteYourFriendsHeader)

let joinRoomLinkElem = document.createElement("p")
joinRoomLinkElem.id = "joinRoomLinkElem"
joinRoomLinkElem.innerHTML = "Share the link: <br>"

let joinRoomLink = document.createElement("a")
joinRoomLink.target = "_blank"
joinRoomLinkElem.appendChild(joinRoomLink)
inviteYourFriendsDiv.appendChild(joinRoomLinkElem)

let QRImageElement = document.createElement("img")
QRImageElement.id = "QRImageElement"
inviteYourFriendsElem.appendChild(QRImageElement)

let gameSettingsElem = document.createElement("div")
gameSettingsElem.id = "gameSettingsElem"
inRoomContainer.appendChild(gameSettingsElem)

//Create link to tutorial.
let tutorial = document.createElement("a")
tutorial.target = "_blank"
tutorial.href = "https://drive.google.com/file/d/1aGyekkldVouVY2Hy7SXTTvhS7I5X6o8O/view"
tutorial.id = "tutorialLink"
tutorial.innerHTML = "Mahjong 4 Friends Tutorial"
roomManager.appendChild(tutorial)

roomManager.appendChild(document.createElement("br"))

//Create link to tutorial.
let documentation = document.createElement("a")
documentation.target = "_blank"
documentation.href = "https://docs.google.com/document/d/1sSGxlRHMkWYHjYhxJTLvHoFsVPAgSs7DFRpsZLmgIvc/edit#heading=h.t7shfpx0qwex"
documentation.id = "documentationLink"
documentation.innerHTML = "See Full Documentation"
roomManager.appendChild(documentation)

let supportInfo = document.createElement("p")
supportInfo.id = "supportInfo"
supportInfo.innerHTML = "Questions, Comments, or Concerns? Contact <a href='mailto:support@mahjong4friends.com'>support@mahjong4friends.com</a>"
roomManager.appendChild(supportInfo)

if (window.Capacitor || window.isAndroid) {
	let ratingPrompt = document.createElement("p")
	ratingPrompt.id = "supportInfo"
	if (window.Capacitor) {
		ratingPrompt.innerHTML = `Enjoying Mahjong 4 Friends? Please <a href="https://apps.apple.com/us/app/mahjong-4-friends/id1552704332" target="_blank">rate us in the App Store</a>!`
	}
	else if (window.isAndroid){
		ratingPrompt.innerHTML = `Enjoying Mahjong 4 Friends? Please <a href="https://play.google.com/store/apps/details?id=com.mahjong4friends.twa" target="_blank">leave a review on Google Play</a>!`
	}
	roomManager.appendChild(ratingPrompt)
}
else {
	let externalAppStoresDiv = document.createElement("div")
	externalAppStoresDiv.id = "externalAppStoresDiv"
	roomManager.appendChild(externalAppStoresDiv)

	function createButton(href, src, text) {
		let link = document.createElement("a")
		link.href = href
		link.target = "_blank"

		let img = document.createElement("img")
		img.src = src
		img.alt = text

		link.appendChild(img)
		externalAppStoresDiv.appendChild(link)
	}

	createButton(
		"https://apps.apple.com/us/app/mahjong-4-friends/id1552704332",
		"assets/badges/appstore.svg",
		"Get Mahjong 4 Friends on the App Store"
	)

	createButton(
		"https://play.google.com/store/apps/details?id=com.mahjong4friends.twa",
		"assets/badges/googleplay.svg",
		"Get Mahjong 4 Friends on Google Play"
	)
}


let copyrightNotice = document.createElement("p")
copyrightNotice.innerHTML = "Copyright © 2020, All Rights Reserved"
copyrightNotice.id = "copyrightNotice"
roomManager.appendChild(copyrightNotice)

//TODO: Need some ERROR HANDLING!!!!! speechSynthesis may not work/exist.
//TODO: Also need a way to deal with reloads.
speechSynthesis.getVoices() //Not a no-op, Google Chrome bug causes very first call from loaded page to return empty, some sort of delay with it.

let voiceChoices = {}
window.voiceChoices = voiceChoices

function VoiceSelector() {
	let voiceOptionsSelect = document.createElement("select")
	let availableVoices = speechSynthesis.getVoices()
	console.log(availableVoices)

	//We need to have a default, as some browsers (firefox) return an empty array for getVoices, but work.
	let noneChoice = document.createElement("option")
	noneChoice.value = "none"
	noneChoice.innerHTML = "No Voice"
	noneChoice.selected = true
	voiceOptionsSelect.appendChild(noneChoice)

	let defaultChoice = document.createElement("option")
	defaultChoice.value = "default"
	defaultChoice.innerHTML = "Default Voice"
	//defaultChoice.selected = true
	voiceOptionsSelect.appendChild(defaultChoice)

	availableVoices.forEach((voice, index) => {
		let choice = document.createElement("option")
		choice.value = index
		choice.innerHTML = voice.lang + "(" + voice.name + ")"
		voiceOptionsSelect.appendChild(choice)
	})

	this.elem = voiceOptionsSelect

	this.get = function() {
		return  availableVoices[Number(voiceOptionsSelect.value)] || voiceOptionsSelect.value
	}
	this.set = function(voiceSelection = "none") {
		voiceOptionsSelect.value = voiceSelection
		if (availableVoices.indexOf(voiceSelection) !== -1) {
			voiceOptionsSelect.value = availableVoices.indexOf(voiceSelection)
		}
	}
}

function renderPlayerView(clientList = [], kickUserCallback) {
	while (playerView.firstChild) {playerView.firstChild.remove()}

	clientList.forEach((obj) => {
		let row = document.createElement("div")
		row.classList.add("playerViewRow")

		let nameSpan = document.createElement("span")
		nameSpan.classList.add("playerViewNameSpan")
		nameSpan.innerHTML = obj.nickname
		row.appendChild(nameSpan)

		let card = document.createElement("span")
		card.classList.add("playerViewCard")
		row.appendChild(card)

		let voiceChoice = document.createElement("span")
		voiceChoice.classList.add("playerViewVoiceChoice")
		row.appendChild(voiceChoice)

		function setNicknameEditable(span, targetId) {
			span.classList.add("editableName")

			let promptText = `Enter a new nickname for ${obj.nickname}: `
			if (targetId === window.clientId) {
				promptText = "Enter a new nickname: "
			}

			nameSpan.addEventListener("click", function() {
				let res = prompt(promptText)
				if (res !== null) {
					window.stateManager.setNickname(res, obj.id)
				}
			})
		}

		if (obj.id === window.clientId) {
			voiceChoice.innerHTML = "N/A"

			//You can edit your own nickname.
			setNicknameEditable(nameSpan, obj.id)

			if (window.stateManager.isHost) {
				card.innerHTML = "You (Host)"
			}
			else {
				card.innerHTML = "You"
			}
		}
		else {
			voiceChoices[obj.id] = voiceChoices[obj.id] || new VoiceSelector()
			voiceChoice.appendChild(voiceChoices[obj.id].elem)

			if (obj.isHost) {
				card.innerHTML = "Host"
			}
			else if (window.stateManager.isHost) {

				//The host can edit any nicknames.
				setNicknameEditable(nameSpan, obj.id)

				let kickButton = document.createElement("button")
				kickButton.innerHTML = "Remove " + obj.nickname
				kickButton.classList.add("playerViewKickButton")
				kickButton.addEventListener("click", function() {
					if (confirm("Are you sure you want to remove " + obj.nickname)) {
						kickUserCallback(obj.id)
					}
				})
				card.appendChild(kickButton)
			}
			else {
				card.innerHTML = "Player"
			}
		}

		playerView.appendChild(row)
	})
}

function enterRoom() {
	inRoomContainer.style.display = "block"
	notInRoomContainer.style.display = "none"
	let queryParam = "#roomId=" + stateManager.inRoom
	joinRoomLink.href = queryParam
	if (window.isNative) {
	    joinRoomLink.href = "https://mahjong4friends.com" + queryParam
	}
	joinRoomLink.innerHTML = joinRoomLink.href
	try {
		let dpi = 4

		let qrGenerator = QRCode(0, "H"); //0 is for auto-detection. We want maximum error correction.

		//Generate the code.
		qrGenerator.addData(joinRoomLink.href)
		qrGenerator.make()

		//Draw the code into a canvas
		let cnv = document.createElement("canvas")
		let pixelsPerBlock = 3 * dpi
		cnv.width = cnv.height = qrGenerator.getModuleCount() * pixelsPerBlock

		let ctx = cnv.getContext("2d")
		qrGenerator.renderTo2dContext(ctx, pixelsPerBlock)

		//Copy the code into a new canvas, width padding added.
		let paddingPixels = 6 * dpi

		let drawCanvas = document.createElement("canvas")
		drawCanvas.width = drawCanvas.height = cnv.width + paddingPixels * 2

		let drawCtx = drawCanvas.getContext("2d")
		drawCtx.fillStyle = "white"
		drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height)

		drawCtx.drawImage(cnv, paddingPixels, paddingPixels)


		//Insert the Mahjong logo.
		let img = document.createElement("img")
		img.src = "assets/tiles/dragons/green.png"
		img.addEventListener("load", function() {
			let centerPadding = 3 * dpi //Pixels to pad the center image.

			let maxCenterSize = drawCanvas.width * 0.3 //No hard requirement on what we can do, but 20% is fine.

			let width = img.width
			let height = img.height

			let ratio = Math.max(1, Math.max(width, height)/maxCenterSize)

			width /= ratio
			height /= ratio

			let left = drawCanvas.width / 2 - width / 2
			let top = drawCanvas.height / 2 - height / 2

			drawCtx.fillRect(left - centerPadding, top - centerPadding, width + centerPadding * 2, height + centerPadding * 2);

			drawCtx.drawImage(img, left, top, width, height)
			QRImageElement.src = drawCanvas.toDataURL("image/png")
			QRImageElement.width = QRImageElement.height = drawCanvas.width / dpi
		})

		QRImageElement.src = drawCanvas.toDataURL("image/png")
		QRImageElement.width = QRImageElement.height = drawCanvas.width / dpi
	}
	catch (e) {
		console.error(e)
	}
}

function exitRoom() {
	inRoomContainer.style.display = "none"
	notInRoomContainer.style.display = "block"
}

window.stateManager.onJoinRoom = function(obj) {
	if (obj.status === "error") {
		return new Popups.Notification("Unable to Join Room", obj.message).show()
	}
	else {
		currentRoom.innerHTML = "You are in room " + obj.message
		enterRoom()
	}
}

window.stateManager.onCreateRoom = function(obj) {
	if (obj.status === "error") {
		return new Popups.Notification("Unable to Create Room", obj.message).show()
	}
	else {
		currentRoom.innerHTML = "You are hosting room " + obj.message
		enterRoom()
	}
}

window.stateManager.onLeaveRoom = function(obj) {
	exitRoom()
	//We left the room. Change clientId.
	const StateManager = require("./StateManager.js")
	StateManager.setClientId(StateManager.createNewClientId())
	//Don't show somebody that they left the room. Just exit.
	//Don't show the host that they closed the room. Just exit.
	if (obj.message !== "You closed the room. " && obj.message !== "You left the room. ") {
		new Popups.Notification("Out of Room", obj.message).show()
	}
}

window.stateManager.addEventListener("onStateUpdate", function(obj) {
	console.log(obj)

	playerCount.innerHTML = obj.message.clients.length + "/4 Players are Present"

	let choices = gameSettings?.getChoices()

	if (window.stateManager.isHost) {
		startGameButton.style.display = "none"
		addBotButton.style.display = ""
		closeRoomButton.style.display = ""
		leaveRoomButton.style.display = ""

		gameSettings = new SettingsMenu(gameSettingsElem, true)
		gameSettings.setChoices(choices)

		if (obj.message.clients.length === 1) {
			//This player is the only one in the room. (So if they aren't host, there's a bug)
			//If they leave, the room closes. Hide the leave room button.
			leaveRoomButton.style.display = "none"
		}
		else if (obj.message.clients.length === 4) {
			startGameButton.style.display = ""
			addBotButton.style.display = "none"
		}

	}
	else {
		addBotButton.style.display = "none"
		closeRoomButton.style.display = "none"
		startGameButton.style.display = "none"
		leaveRoomButton.style.display = ""

		gameSettings = new SettingsMenu(gameSettingsElem, false)
		gameSettings.setChoices(choices)
	}

	window.gameSettings = gameSettings //FOR TESTING!

	renderPlayerView(obj.message.clients, function kickUserCallback(userId) {
		window.stateManager.kickUser(window.stateManager.roomId, userId)
	})
})

window.stateManager.getCurrentRoom() //If we are already in a room, this will issue the correct callbacks to enter us into it.


window.stateManager.addEventListener("onStartGame", function() {
	roomManager.style.display = "none"
})

window.stateManager.addEventListener("onEndGame", function(obj) {
	roomManager.style.display = ""
	if (obj.message !== "State Sync") {
		//State Sync game ends happen to the person that ends the game, as well as in development mode.
		new Popups.Notification("Game Ended", obj.message).show()
	}
	else {console.log("Game Ended due to state sync. Popup suppressed in dev mode. ")}
})

let isDevMode = false;

//Allow query params.
let params = new URLSearchParams("?" + window.location.hash.slice(1))
if (params.has("roomId")) {
	roomIdInput.value = params.get("roomId")
}
if (params.has("name")) {
	nicknameInput.value = params.get("name")
}

//This feature is intended for development use only. Show a warning.
if (params.has("clientId") && !params.get("clientId").startsWith("bot")) {
	isDevMode = true
	new Popups.MessageBar("This page is in development mode due to the clientId parameter. ").show(8000)
}

module.exports = roomManager
