const ErrorPopup = require("./ErrorPopup.js")


//Allow the user to join and create rooms.
let roomManager = document.createElement("div")
roomManager.id = "roomManager"
document.body.appendChild(roomManager)

let copyrightNotice = document.createElement("p")
copyrightNotice.innerHTML = "Copyright © 2020, All Rights Reserved"
copyrightNotice.id = "copyrightNotice"
roomManager.appendChild(copyrightNotice)


//In order to get the "with friends" part styled differently, we will need 3 elements for our heading.
let heading = document.createElement("div")
heading.id = "heading"
roomManager.appendChild(heading)

let mahjongHeading = document.createElement("h1")
mahjongHeading.innerHTML = "Mahjong"
mahjongHeading.id = "mahjongHeading"
heading.appendChild(mahjongHeading)

let withFriendsHeading = document.createElement("h1")
withFriendsHeading.innerHTML = "with Friends"
withFriendsHeading.id = "withFriendsHeading"
heading.appendChild(withFriendsHeading)

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
	if (roomIdInput.value.trim().length < 5) {
		return new ErrorPopup("Room Name Invalid", "The room name should be at least 5 characters long. Please enter it into the box labeled \"Enter Room Name\" ").show()
	}
	window.stateManager.joinRoom(roomIdInput.value, nicknameInput.value)
})
joinOrCreateRoom.appendChild(joinRoom)

let createRoom = document.createElement("button")
createRoom.id = "createRoom"
createRoom.innerHTML = "Create Room"
createRoom.addEventListener("click", function() {
	if (roomIdInput.value.trim().length < 5) {
		return new ErrorPopup("Unable to Create Room", "Please pick a 5+ character long name, and enter it into the box labeled \"Enter Room Name\" ").show()
	}
	window.stateManager.createRoom(roomIdInput.value, nicknameInput.value)
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

function renderPlayerView(clientList = [], userId, kickUserCallback) {
	while (playerView.firstChild) {playerView.firstChild.remove()}
	let userIsHost;
	clientList.forEach((obj) => {
		if (obj.id === userId) {
			userIsHost = obj.isHost
		}
	})
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

		if (obj.id === userId) {
			if (userIsHost) {
				card.innerHTML = "You (Host)"
			}
			else {
				card.innerHTML = "You"
			}
		}
		else if (obj.isHost) {
			card.innerHTML = "Host"
		}
		else if (userIsHost) {
			card.innerHTML = "Kick " + obj.nickname
			card.classList.add("playerViewKickButton")
			card.addEventListener("click", function() {
				if (confirm("Are you sure you want to kick " + obj.nickname)) {
					kickUserCallback(obj)
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
		return new ErrorPopup("Unable to Join Room", obj.message).show()
	}
	else {
		currentRoom.innerHTML = "You are in room " + obj.message
		enterRoom()
	}
}

window.stateManager.onCreateRoom = function(obj) {
	if (obj.status === "error") {
		return new ErrorPopup("Unable to Create Room", obj.message).show()
	}
	else {
		currentRoom.innerHTML = "You are hosting room " + obj.message
		enterRoom()
	}
}

window.stateManager.onClientListChange = function(obj) {
	console.log(obj)
	playerCount.innerHTML = obj.message.length + "/4 Players are Present"
	renderPlayerView(obj.message, window.clientId)
}


module.exports = roomManager
