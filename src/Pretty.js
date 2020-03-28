function Pretty(value, seasonOrFlower) {

	if (!["season", "flower"].includes(seasonOrFlower)) {
		throw "seasorOrFlower must either be 'season' or 'flower'"
	}

	this.type = "pretty"
	this.value = value
	this.seasonOrFlower = seasonOrFlower

	let numberToWind = ["east", "south", "west", "north"]

	this.isDouble = function(userWind) {
		if (userWind === numberToWind[this.value - 1]) {
			return true
		}
		return false
	}

	this.getPoints = function() {return 4}

	this.isSequence = false
	this.isPongOrKong = false
	this.isPair = false
}
