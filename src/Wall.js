const Tile = require("./Tile.js")
const Pretty = require("./Pretty.js")

function Wall() {
	this.tiles = []

	this.drawFirst = function() {
		return this.tiles.pop()
	}

	this.drawLast = function() {
		return this.tiles.shift()
	}

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
	function shuffleArray(array) {
		//Durstenfeld shuffle
	    for (let i = array.length - 1; i > 0; i--) {
	        const j = Math.floor(Math.random() * (i + 1));
	        [array[i], array[j]] = [array[j], array[i]];
	    }
	}

	shuffleArray(this.tiles)


}

module.exports = Wall
