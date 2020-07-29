const Popups = require("./Popups.js")

//Allow the user to join and create rooms.
let roomManager = document.createElement("div")
roomManager.id = "roomManager"
document.body.appendChild(roomManager)

let copyrightNotice = document.createElement("p")
copyrightNotice.innerHTML = "Copyright © 2020, All Rights Reserved"
copyrightNotice.id = "copyrightNotice"
roomManager.appendChild(copyrightNotice)


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

startGameButton.addEventListener("click", function() {
	window.stateManager.startGame()
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

		let idSpan = document.createElement("span")
		idSpan.className = "playerViewIdSpan"
		idSpan.innerHTML = "User ID: " + obj.id
		row.appendChild(idSpan)

		if (obj.id === window.clientId) {
			if (window.stateManager.isHost) {
				card.innerHTML = "You (Host)"
			}
			else {
				card.innerHTML = "You"
			}
		}
		else if (obj.isHost) {
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
		playerView.appendChild(row)
	})
}

function enterRoom() {
	inRoomContainer.style.display = "block"
	notInRoomContainer.style.display = "none"
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

	if (window.stateManager.isHost) {
		startGameButton.style.display = "none"
		addBotButton.style.display = ""
		closeRoomButton.style.display = ""
		leaveRoomButton.style.display = ""

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
	}

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

//This feature is for development use only. Show a warning.
if (params.has("clientId")) {
	isDevMode = true
	new Popups.MessageBar("This page is in development mode due to the clientId parameter. ").show(8000)
}


module.exports = roomManager
