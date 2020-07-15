const Sequence = require("../Sequence.js")
const Pretty = require("../Pretty.js")

function getClearHandDoubles() {
	let suits = {}
	let honors = false
	let onesAndNines = true

	this.contents.forEach((item) => {
		if (item instanceof Sequence) {
			suits[item.tiles[0].type] = true
			onesAndNines = false
		}
		else if (!(item instanceof Pretty)){
			suits[item.type] = true
			if (!["wind", "dragon"].includes(item.type) && item.value !== 1 && item.value !== 9) {
				onesAndNines = false
			}
		}
	})

	if (suits["wind"] || suits["dragon"]) {
		delete suits["wind"]
		delete suits["dragon"]
		honors = true
	}

	suits = Object.keys(suits).length
	if (suits === 0) {
		//All honors
		return 3
	}
	else if (suits === 1 && !honors) {
		return 3
	}
	else if (suits === 1 && honors) {
		return 1
	}
	else if (onesAndNines && !honors) {
		return 3
	}
	else if (onesAndNines && honors) {
		return 1
	}

	return 0
}

module.exports = getClearHandDoubles
