const Tile = require("./Tile.js")


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








//For testing.

let tiles = new (require("./Wall.js"))().tiles
console.log(tiles)

let handTiles = tiles.slice(-14)
console.log(handTiles)


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
		userHand.insertBefore(elem, ev.target)
	}
	else {
		//Dropped on right side of tile. Insert after.
		userHand.insertBefore(elem, ev.target.nextElementSibling)
	}
}


let userHand = createTopOrBottomHand("userHand")

function drawTile(tile) {
	let elem = document.createElement("img")
	elem.src = tile.imageUrl
	elem.className = "userHandTile"
	elem.draggable = true
	elem.addEventListener("dragstart", drag)
	userHand.appendChild(elem)
}

for (let i=0;i<handTiles.length;i++) {
	let handTile = handTiles[i]
	console.log(handTile)
	drawTile(handTile)
}

userHand.addEventListener("dragover", allowDrop)
userHand.addEventListener("drop", drop)


let leftHandTiles = tiles.slice(-28, -14)

console.log(leftHandTiles)


let leftHandContainer = createLeftOrRightHand("leftHand", "leftHandContainer")

function drawLeftTile(tile) {
	let elem = document.createElement("img")
	elem.src = tile.imageUrl
	elem.className = "leftHandTile"
	leftHandContainer.appendChild(elem)
}

for (let i=0;i<leftHandTiles.length;i++) {
	let leftHandTile = leftHandTiles[i]
	console.log(leftHandTile)
	drawLeftTile(leftHandTile)
}




let rightHandTiles = tiles.slice(-42, -28)

console.log(rightHandTiles)

let rightHandContainer = createLeftOrRightHand("rightHand", "rightHandContainer")

function drawRightTile(tile) {
	let elem = document.createElement("img")
	elem.src = tile.imageUrl
	elem.className = "rightHandTile"
	rightHandContainer.appendChild(elem)
}

for (let i=0;i<rightHandTiles.length;i++) {
	let rightHandTile = rightHandTiles[i]
	console.log(rightHandTile)
	drawRightTile(rightHandTile)
}




let topHandTiles = tiles.slice(-56, -42)

console.log(topHandTiles)

let topHand = createTopOrBottomHand("topHand")


function drawTopTile(tile) {
	let elem = document.createElement("img")
	elem.src = tile.imageUrl
	elem.className = "topHandTile"
	topHand.appendChild(elem)
}

for (let i=0;i<topHandTiles.length;i++) {
	let topHandTile = topHandTiles[i]
	console.log(topHandTile)
	drawTopTile(topHandTile)
}
