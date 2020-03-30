const Tile = require("./Tile.js")


let userHand = document.createElement("div")
userHand.id = "userHand"
document.body.appendChild(userHand)


//For testing.

let tiles = new (require("./Wall.js"))().tiles
console.log(tiles)

let handTiles = tiles.slice(-14)
console.log(handTiles)

function drawTile(tile) {
	let elem = document.createElement("img")
	elem.src = tile.imageUrl
	elem.className = "userHandTile"
	userHand.appendChild(elem)
}

for (let i=0;i<handTiles.length;i++) {
	let handTile = handTiles[i]
	console.log(handTile)
	drawTile(handTile)


}


let leftHandTiles = tiles.slice(-28, -14)

console.log(leftHandTiles)

let leftHand = document.createElement("div")
leftHand.id = "leftHand"
document.body.appendChild(leftHand)

let leftHandContainer = document.createElement("div")
leftHandContainer.id = "leftHandContainer"
leftHand.appendChild(leftHandContainer)

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

let rightHand = document.createElement("div")
rightHand.id = "rightHand"
document.body.appendChild(rightHand)

let rightHandContainer = document.createElement("div")
rightHandContainer.id = "rightHandContainer"
rightHand.appendChild(rightHandContainer)

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

let topHand = document.createElement("div")
topHand.id = "topHand"
document.body.appendChild(topHand)


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
