const Tile = require("./Tile.js")
const Pretty = require("./Pretty.js")

class Wall {
	constructor(tiles) {
		this.drawFirst = function() {
			return this.tiles.pop()
		}

		this.drawLast = function() {
			return this.tiles.shift()
		}

		if (tiles) {
			this.tiles = tiles
		}
		else {
			this.tiles = []

			//Time to add the tiles to the deck...
			for (let i=1;i<=9;i++) {
				for (let c=0;c<4;c++) {
					["bamboo", "character", "circle"].forEach((type) => {
						this.tiles.push(new Tile({
							type,
							value: i
						}))
					})
				}
			}

			;["red", "green", "white"].forEach((value) => {
				for (let i=0;i<4;i++) {
					this.tiles.push(new Tile({
						type: "dragon",
						value: value
					}))
				}
			})

			;["north", "south", "east", "west"].forEach((value) => {
				for (let i=0;i<4;i++) {
					this.tiles.push(new Tile({
						type: "wind",
						value: value
					}))
				}
			})

			;[false, true].forEach((isSeason) => {
				for (let i=1;i<=4;i++) {
					this.tiles.push(new Pretty({
						value: i,
						seasonOrFlower: isSeason?"season":"flower"
					}))
				}
			})

			//Randomly mix the tiles.
			Wall.shuffleArray(this.tiles)
		}

		this.toJSON = (function() {
			return JSON.stringify(this.tiles)
		}).bind(this)
	}

	static shuffleArray(array) {
		//Durstenfeld shuffle
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	static renderWall(div, tilesRemaining) {
		while (div.firstChild) {div.firstChild.remove()} //Delete any existing tiles.

		for (let i=0;i<tilesRemaining;i++) {
			let tile = document.createElement("img")
			tile.src = "assets/tiles/face-down.png"
			div.appendChild(tile)
		}

		if (tilesRemaining === 0) {return} //Don't write "0" to the screen.
		//Write the number of tiles that remain.
		let digits = String(tilesRemaining).split("")
		digits.forEach((digit) => {
			let elem = document.createElement("p")
			elem.innerHTML = digit
			div.appendChild(elem)
		})
	}

	static fromJSON(str) {
		let tiles = JSON.parse(str)
		tiles = tiles.map((tileString) => {
			let obj = JSON.parse(tileString)
			if (obj.class === "Pretty") {
				return Pretty.fromJSON(tileString)
			}
			else if (obj.class === "Tile") {
				return Tile.fromJSON(tileString)
			}
			else {throw "Unable to identify tileString " + tileString}
		})

		return new Wall(tiles)
	}
}

module.exports = Wall
