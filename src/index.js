const Tile = require("./Tile.js")
const Hand = require("./Hand.js")

function createTopOrBottomHand(handId) {
	let hand = document.createElement("div")
	hand.id = handId
	document.body.appendChild(hand)
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


function allowDrop(ev) {
	ev.preventDefault();
}

function drag(ev) {
	let randomClass = "randomClassForTransfer" + (2**53) * Math.random()
	ev.target.classList.add(randomClass)
	ev.dataTransfer.setData("randomClass", randomClass);
}

function drop(ev) {
	ev.preventDefault();
	let randomClass = ev.dataTransfer.getData("randomClass");
	let elem = document.getElementsByClassName(randomClass)[0]
	elem.classList.remove(randomClass)

	let dropPosition = ev.x
	let targetBounds = ev.target.getBoundingClientRect()

	if (targetBounds.right - ev.x > targetBounds.width/2) {
		//Dropped on left side of tile. Insert before.
		userHandElem.insertBefore(elem, ev.target)
	}
	else {
		//Dropped on right side of tile. Insert after.
		userHandElem.insertBefore(elem, ev.target.nextElementSibling)
	}
}







//For testing.

let tiles = new (require("./Wall.js"))().tiles
console.log(tiles)



let handTiles = tiles.slice(-14)

let userHandElem = createTopOrBottomHand("userHand")
let userHand = new Hand()
console.log(userHand)

//userHand.sortTiles(handTiles)
handTiles.forEach((value) => {userHand.add(value)})
userHand.renderTiles(userHandElem, undefined, drag)

userHandElem.addEventListener("dragover", allowDrop)
userHandElem.addEventListener("drop", drop)





let leftHandTiles = tiles.slice(-28, -14)
let leftHandContainer = createLeftOrRightHand("leftHand", "leftHandContainer")

let leftHand = new Hand()

leftHandTiles.forEach((value) => {leftHand.add(value)})
leftHand.renderTiles(leftHandContainer)




let rightHandTiles = tiles.slice(-42, -28)

console.log(rightHandTiles)

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

console.log(topHandTiles)

let topHand = createTopOrBottomHand("topHand")


function drawTopTile(tile) {
	let elem = document.createElement("img")
	elem.src = tile.imageUrl
	topHand.appendChild(elem)
}

for (let i=0;i<topHandTiles.length;i++) {
	let topHandTile = topHandTiles[i]
	drawTopTile(topHandTile)
}
