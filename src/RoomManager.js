//Allow the user to join and create rooms.
let roomManager = document.createElement("div")
roomManager.id = "roomManager"
document.body.appendChild(roomManager)


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
roomIdInput.placeholder = "Enter Room ID..."

roomManager.appendChild(roomIdInput)





module.exports = roomManager
