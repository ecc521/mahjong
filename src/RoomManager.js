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


let roomIdInput = document.createElement("input")
roomIdInput.id = "roomIdInput"
roomIdInput.placeholder = "Enter Room Name..."
roomManager.appendChild(roomIdInput)

//Put the nickname input on a new line.
roomManager.appendChild(document.createElement("br"))

let nicknameInput = document.createElement("input")
nicknameInput.id = "nicknameInput"
nicknameInput.placeholder = "Choose a Nickname..."
roomManager.appendChild(nicknameInput)


let joinOrCreateRoom = document.createElement("div")
joinOrCreateRoom.id = "joinOrCreateRoom"
roomManager.appendChild(joinOrCreateRoom)

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


window.stateManager.onJoinRoom = function(obj) {
	if (obj.status === "error") {
		return new ErrorPopup("Unable to Join Room", obj.message).show()
	}
}

window.stateManager.onCreateRoom = function(obj) {
	if (obj.status === "error") {
		return new ErrorPopup("Unable to Create Room", obj.message).show()
	}
}


module.exports = roomManager
