class Pretty {
	constructor(config = {}) {

		if (!["season", "flower"].includes(config.seasonOrFlower)) {
			throw "config.seasorOrFlower must either be 'season' or 'flower'"
		}

		this.type = "pretty"
		this.value = config.value
		this.seasonOrFlower = config.seasonOrFlower
		this.exposed = true

		let numberToWind = ["east", "south", "west", "north"]

		this.isDouble = function(userWind) {
			if (userWind === numberToWind[this.value - 1]) {
				return true
			}
			return false
		}

		this.getPoints = function() {return 4}

		this.imageUrl = "assets/tiles/" + config.seasonOrFlower + "s" + "/" + config.value + ".png"

		this.toJSON = (function() {
			let obj = {}
			obj.class = "Pretty"
			obj.value = this.value
			obj.seasonOrFlower = this.seasonOrFlower

			return JSON.stringify(obj)
		}).bind(this)

		this.isSequence = false
		this.isPongOrKong = false
		this.isPair = false
	}

	static fromJSON(str) {
		let obj = JSON.parse(str)
		if (obj.class !== "Pretty") {throw "String was not created by Pretty.toJSON()"}
		return new Pretty(obj)
	}
}

module.exports = Pretty
