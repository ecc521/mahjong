function Pretty(config = {}) {

	if (!["season", "flower"].includes(config.seasonOrFlower)) {
		throw "config.seasorOrFlower must either be 'season' or 'flower'"
	}

	this.type = "pretty"
	this.value = config.value
	this.seasonOrFlower = config.seasonOrFlower

	let numberToWind = ["east", "south", "west", "north"]

	this.isDouble = function(userWind) {
		if (userWind === numberToWind[this.value - 1]) {
			return true
		}
		return false
	}

	this.getPoints = function() {return 4}

	this.imageUrl = seasonOrFlower + "/" + value + ".png"

	this.isSequence = false
	this.isPongOrKong = false
	this.isPair = false
}

module.exports = Pretty
