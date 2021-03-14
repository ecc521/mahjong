const Tile = require("./Tile.js")
const Pretty = require("./Pretty.js")
const SeedRandom = require("seed-random")

class Wall {
	constructor(seed = Math.random()) {
		this.drawFirst = function() {
			return this.tiles.pop()
		}

		this.tiles = []

		//Time to add the tiles to the deck...
		this.tiles = this.tiles.concat(Wall.getNonPrettyTiles())

		;[false, true].forEach((isSeason) => {
			for (let i=1;i<=4;i++) {
				this.tiles.push(new Pretty({
					value: i,
					seasonOrFlower: isSeason?"season":"flower"
				}))
			}
		})

		//Randomly mix the tiles.
		Wall.shuffleArray(this.tiles, seed)

		this.toJSON = (function() {
			return JSON.stringify(this.tiles)
		}).bind(this)
	}

	static getNonPrettyTiles(amount = 4) {
		//We have this as a static method because it can be useful to obtain a copy of every playing tiles in the game.
		let tiles = []
		for (let i=1;i<=9;i++) {
			for (let c=0;c<amount;c++) {
				["bamboo", "character", "circle"].forEach((type) => {
					tiles.push(new Tile({
						type,
						value: i
					}))
				})
			}
		}

		;["red", "green", "white"].forEach((value) => {
			for (let i=0;i<amount;i++) {
				tiles.push(new Tile({
					type: "dragon",
					value: value
				}))
			}
		})

		;["north", "south", "east", "west"].forEach((value) => {
			for (let i=0;i<amount;i++) {
				tiles.push(new Tile({
					type: "wind",
					value: value
				}))
			}
		})
		return tiles
	}

	static shuffleArray(array, seed) {
		let random = SeedRandom(seed)

		//Durstenfeld shuffle
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	static renderWall(div, tilesRemaining) {
		while (div.firstChild) {div.firstChild.remove()} //Delete any existing tiles.

		for (let i=0;i<tilesRemaining.length;i++) {
			let tile = tilesRemaining[i]
			let tileImage = document.createElement("img")
			tileImage.src = tile.imageUrl
			tileImage.title = tile.tileName
			div.appendChild(tileImage)
		}

		if (tilesRemaining.length === 0) {return} //Don't write "0" to the screen.
		//Write the number of tiles that remain.
		let digits = String(tilesRemaining.length).split("")
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
