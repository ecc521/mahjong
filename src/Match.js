const Tile = require("./Tile.js")

class Match {
	constructor(config = {}) {

		if (config.exposed == undefined) {throw "Must specify either true or false for config.exposed. "}

		if (config.amount < 2 || config.amount > 4) {throw "config.mount must be either 2, 3, or 4. "}

		this.type = config.type
		this.value = config.value
		this.amount = config.amount
		this.exposed = config.exposed

		this.getComponentTile = function() {
			return new Tile({
				type: this.type,
				value: this.value
			})
		}

		this.getPoints = function(userWind) {

			let points = 0;

			if (["bamboo", "character", "circle"].includes(this.type)) {
				points = 2
				if (this.value === 1 || this.value === 9) {
					points *= 2
					if (this.amount === 2) {return 2} //This is a pair. It's worth 2 points
				}
				if (this.amount === 2) {return 0} //Worthless pair
			}
			else {
				points = 4 //Either wind or dragon. 4 points for pong.
				if (this.amount === 2) {
					if (this.type === "wind" && this.value !== userWind) {return 0} //Not own wind. Worthless pair.
					return 2 //2 points for pair.
				}
			}


			if (this.amount === 4) {points *= 4} //Kongs worth 4 times as much as pongs.
			if (!exposed) {points *= 2} //In hand worth 4 times as much.
			return points
		}

		this.isDouble = function(userWind) {
			if (this.amount === 2) {return false} //Pairs never give doubles.
			if (this.type === "dragon") {return true}
			if (this.type === "wind" && this.value === userWind) {return true}
			return false
		}

		Object.defineProperty(this, "tiles", {
			get: (function getTiles() {
				return new Array(this.amount).fill(0).map((() => {return this.getComponentTile()}).bind(this))
			}).bind(this)
		})

		Object.defineProperty(this, "isPair", {
			get: function isPair() {
				if (this.amount === 2) {return true}
				return false
			}
		})

		Object.defineProperty(this, "isPongOrKong", {
			get: function isPongOrKong() {
				if (this.amount >= 3) {return true}
				return false
			}
		})

		this.toJSON = (function() {
			let obj = {}
			obj.class = "Match"
			obj.type = this.type
			obj.value = this.value
			obj.amount = this.amount
			obj.exposed = this.exposed

			return JSON.stringify(obj)
		}).bind(this)

		this.isSequence = false
	}

	static isValidMatch(tiles) {
		//Confirm that the tiles all match.
		//Note that if two tiles are equal, that means they are the same tile, just referenced twice. That is not a valid match, however we currently do not check for that.
		for (let i=0;i<tiles.length;i++) {
			if (!tiles[0].matches(tiles[i])) {return false}
		}

		return true
	}

	static fromJSON(str) {
		let obj = JSON.parse(str)
		if (obj.class !== "Match") {throw "String was not created by Match.toJSON()"}
		return new Match(obj)
	}
}

module.exports = Match
