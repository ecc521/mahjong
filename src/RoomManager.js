const Popups = require("./Popups.js")
const SettingsMenu = require("./RoomManager/SettingsMenu.js")

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

let joinRoom = document.createElement("button")
joinRoom.id = "joinRoom"
joinRoom.innerHTML = "Join Room"
joinRoom.addEventListener("click", function() {
	if (roomIdInput.value.trim().length === 0) {
		return new Popups.Notification("Room Name Invalid", "The room name contains at least one character. Please enter it into the box labeled \"Enter Room Name\" ").show()
	}
	if (nicknameInput.value.length > 18
		&& !confirm("Extremely long names may cause visual display problems on some devices. Proceed?")
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
	if (nicknameInput.value.length > 18
		&& !confirm("Extremely long names may cause visual display problems on some devices. Proceed?")
	) {return}
	window.stateManager.createRoom(roomIdInput.value.toLowerCase(), nicknameInput.value)
})
joinOrCreateRoom.appendChild(createRoom)

let screenRotationAlert = document.createElement("p")
screenRotationAlert.id = "screenRotationAlert"
screenRotationAlert.innerHTML = "Rotating your screen to Landscape mode is recommended. "
notInRoomContainer.appendChild(screenRotationAlert)

function setScreenRotationAlert(event) {
	let orientation = window.screen?.orientation?.type
	//Window.innerWidth is returning the wrong value in simulator. May not be an issue on actual devices, but screen.width works fine.
	if (orientation && orientation.includes("portrait") && screen.width < 900) {
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
	if (name.length > 18 && !confirm("Extremely long names may cause visual display problems on some devices. Proceed?")) {return}
	window.stateManager.addBot(name)
})

let gameSettingsElem = document.createElement("div")
gameSettingsElem.id = "gameSettingsElem"
inRoomContainer.appendChild(gameSettingsElem)

let joinRoomLinkElem = document.createElement("p")
joinRoomLinkElem.id = "joinRoomLinkElem"
joinRoomLinkElem.innerHTML = "Link to this room: "

let joinRoomLink = document.createElement("a")
joinRoomLink.target = "_blank"
joinRoomLinkElem.appendChild(joinRoomLink)
inRoomContainer.appendChild(joinRoomLinkElem)

let roomSaveIdElem = document.createElement("p")
roomSaveIdElem.id = "roomSaveIdElem"
inRoomContainer.appendChild(roomSaveIdElem)

//Create link to tutorial.
let tutorial = document.createElement("a")
tutorial.target = "_blank"
tutorial.href = "https://docs.google.com/document/d/1sSGxlRHMkWYHjYhxJTLvHoFsVPAgSs7DFRpsZLmgIvc/"
tutorial.id = "tutorialLink"
tutorial.innerHTML = "Mahjong 4 Friends Tutorial"
roomManager.appendChild(tutorial)

let supportInfo = document.createElement("p")
supportInfo.id = "supportInfo"
supportInfo.innerHTML = "Questions, Comments, or Concerns? Contact <a href='mailto:support@mahjong4friends.com'>support@mahjong4friends.com</a>"
roomManager.appendChild(supportInfo)

let ratingPrompt = document.createElement("p")
ratingPrompt.id = "supportInfo"
ratingPrompt.innerHTML = `Enjoying Mahjong 4 Friends? Please <a href="https://play.google.com/store/apps/details?id=com.mahjong4friends.twa&hl=en_US&gl=US" target="_blank">leave a review on Google Play</a>!`
roomManager.appendChild(ratingPrompt)

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
		row.className = "playerViewRow"

		let nameSpan = document.createElement("span")
		nameSpan.className = "playerViewNameSpan"
		nameSpan.innerHTML = obj.nickname
		row.appendChild(nameSpan)

		let card = document.createElement("span")
		card.className = "playerViewCard"
		row.appendChild(card)

		let voiceChoice = document.createElement("span")
		voiceChoice.className = "playerViewVoiceChoice"
		row.appendChild(voiceChoice)

		let idSpan = document.createElement("span")
		idSpan.className = "playerViewIdSpan"
		idSpan.innerHTML = "User ID: " + obj.id
		row.appendChild(idSpan)

		if (obj.id === window.clientId) {
			voiceChoice.innerHTML = "N/A"

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
				card.innerHTML = "Kick " + obj.nickname
				card.classList.add("playerViewKickButton")
				card.addEventListener("click", function() {
					if (confirm("Are you sure you want to kick " + obj.nickname)) {
						kickUserCallback(obj.id)
					}
				})
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
	joinRoomLink.href = "?roomId=" + stateManager.inRoom
	joinRoomLink.innerHTML = joinRoomLink.href
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
	new Popups.Notification("Out of Room", obj.message).show()
}

window.stateManager.addEventListener("onStateUpdate", function(obj) {
	console.log(obj)

	playerCount.innerHTML = obj.message.clients.length + "/4 Players are Present"
	roomSaveIdElem.innerHTML = "In-Game Debugging ID: " + obj.message.saveId

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

	window.gameSettings = gameSettings //For TESTING!!!

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
	if (!isDevMode || obj.message !== "State Sync") {
		//If we are in dev mode, and the message is "State Sync", suppress this warning.
		new Popups.Notification("Game Ended", obj.message).show()
	}
	else {console.log("Game Ended due to state sync. Popup suppressed in dev mode. ")}
})

let isDevMode = false;

//Allow query params.
let params = new URLSearchParams(window.location.search)
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
