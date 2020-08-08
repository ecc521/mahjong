const Tile = require("../../src/Tile.js")
const Hand = require("../../src/Hand.js")
const Match = require("../../src/Match.js")
const Pretty = require("../../src/Pretty.js")

function evaluateNextMove() {
	let room = this.getRoom()

	if (room.inGame === false) {return} //Nothing for us to do not in a game.

	let gameData = room.gameData
	let currentHand = gameData.playerHands[this.clientId]

	if (gameData.currentTurn.turnChoices[this.clientId]) {return}; //We are ready for this turn.


	//Call room.onPlace properly.
	let placeTiles = (function placeTiles(tiles = [], goMahjong = currentHand.isMahjong()) {
		console.log(tiles)
		if (!(tiles instanceof Array)) {tiles = [tiles]}
		room.onPlace({
			mahjong: goMahjong,
			type: "roomActionPlaceTiles",
			message: tiles = tiles.map((tile) => {return tile.toJSON()})
		}, this.clientId)
	}).bind(this)


	if (currentHand.isMahjong()) {return placeTiles()} //Go mahjong.

	function computeHandBreakdown(tiles, userWind, customConfig = {}) {
		tiles = tiles.filter((item) => {return !(item instanceof Pretty)})

		//TODO: Need support for clearing to terminals (1s and 9s), even though it is somewhat rare.
		//TODO: Also need to weigh 1s and 9s more highly than other tiles when choosing suits and what to throw.
		//TODO: Also need to weigh dragons and own wind above other winds.
		//TODO: Need to throw dead or nearly dead tiles sooner.

		let config = {
			looseTileCost: 5, //We should cut this dramatically if we have yet to charleston. Probably pass around 2.
			possibleDoubleRatio: 0.4, //Should be no more than 1. Reduction in double value for first pair that might result in doubles.
			chooseSecondarySuit: false, //Intended for charleston, don't suggest weakest suit, suggest next weakest, if there are all 3.
			charleston: false //Used to determine in hand kong placements.
		}
		Object.assign(config, customConfig)


		let breakdown = {}
		tiles.forEach((tile) => {
			let type = tile.type
			if (["wind", "dragon"].includes(tile.type)) {
				type = "honor"
			}
			breakdown[type] = breakdown[type] || []
			breakdown[type].push(tile)
		})

		//For .sort
		function getValue(item) {
			if (item instanceof Tile) {return Math.random()} //We want the tiles to be randomly ordered. This is far from perfect, but should help move them slightly.
			return item.amount
		}

		function prepForSelection(arr) {
			arr.sort((a, b) => {
				return getValue(a) - getValue(b)
			})
			arr = arr.filter((a) => {
				if (!a.isGenerated && a instanceof Match) {return false}
				else {
					return true;
				}
			})
			return arr
		}

		for (let type in breakdown) {
			let tiles = breakdown[type]

			let generationHand = new Hand()
			generationHand.contents = tiles.slice(0)

			for (let i=0;i<generationHand.contents.length;i++) {
				let tile = generationHand.contents[i]
				if (!(tile instanceof Tile)) {continue;}
				;[4,3,2].forEach(((amount) => {
					if (generationHand.removeMatchingTilesFromHand(tile, amount)) {
						i-- //Counteract position shifting.
						let item = new Match({amount, type: tile.type, value: tile.value, exposed: false})
						item.isGenerated = true
						generationHand.contents.push(item)
					}
				}).bind(this))
			}

			//If we start off with ANY honor doubles, we will include honors.
			let obj = generationHand.contents.reduce((totals, currentItem) => {

				//Weight: The cost of clearing away.
				//Value: The value this suit provides.
				totals.weight += config.looseTileCost * (currentItem.amount || 1)

				//valueMult: Multiplier for value (only applicable to honors) due to doubles.
				if (currentItem.isDouble(userWind)) {
					totals.valueMult += 1
				}
				else if (currentItem.isDouble(userWind, true)) {
					if (Math.round(totals.valueMult) === totals.valueMult) {
						totals.valueMult += config.possibleDoubleRatio //TODO: We should have dragons be lower than your wind
					}
					else {totals.valueMult += 1} //We only go out with one pair, therefore, if we keep honors, we will at most have one potential, non guaranteed, double.
				}

				if (currentItem.amount === 2) {
					totals.value += 10
				}
				else if (currentItem.amount === 3) {
					totals.value += 25
				}
				else if (currentItem.amount === 4) {
					totals.value += 40
				}

				return totals
			}, {weight: 0, value: 0, valueMult: 0})

			obj.value *= (2 ** obj.valueMult)
			delete obj.valueMult

			Object.assign(obj, {
				tiles,
				contents: generationHand.contents
			})

			obj.contents = prepForSelection(obj.contents)

			breakdown[type] = obj
		}

		//Decide recommended strategy.
		let standardTypes = Object.assign({}, breakdown)
		delete standardTypes.honor
		let strategy = {
			honors: false
		}

		let suits = Object.keys(standardTypes)
		if (suits.length > 1) {strategy.honors = true} //No reason to eliminate honors at the moment.
		if (suits.length === 1) {strategy.suit = suits[0]}
		else {
			let results = []
			for (let key in standardTypes) {
				//If contents does not exist, or is empty, omit type from consideration. There is nothing we can throw, as all tiles are exposed.
				if (standardTypes[key].contents.length === 0) {continue}
				results.push([
					key, standardTypes[key].value + standardTypes[key].weight
				])
			}
			if (results.length !== 0) {
				strategy.results = results
				results.sort((a, b) => {return b[1] - a[1]}) //Highest value suits first.
				strategy.suit = results[0][0]
				strategy.throwSuit = results[results.length - 1][0]

				//TODO: Only choose secondary suit if it would NOT result in breaking up a pong, etc.
				if (config.chooseSecondarySuit && results.length === 3) {
					strategy.throwSuit = results[1][0]
				}
			}
			else {
				//We have no normal suits. Honors for now.
				strategy.suit = "honor"
				strategy.throwSuit = "honor"
			}
		}

		if (strategy.suit !== "honor" && breakdown.honor && breakdown.honor.value + breakdown.honor.weight > standardTypes[strategy.suit].value / 2) {strategy.honors = true}

		if (strategy.throwSuit === strategy.suit && strategy.honors === false) {strategy.throwSuit = "honor"}

		strategy.throw = breakdown[strategy.throwSuit]?.contents?.[0]

		breakdown.tiles = []
		breakdown.contents = []
		for (let suit in breakdown) {
			if (!breakdown[suit].tiles) {continue;}
			breakdown.tiles = breakdown.tiles.concat(breakdown[suit].tiles)
			breakdown.contents = breakdown.contents.concat(breakdown[suit].contents)
		}

		if (!strategy.throw) {
			console.warn("WARNING: A throw was not found through normal measures. Picking tile to avoid crash. ")
			breakdown.contents = prepForSelection(breakdown.contents)
			strategy.throw = breakdown.contents[0]
		}

		if (strategy.throw instanceof Match) {strategy.throw = strategy.throw.getComponentTile()}

		//One last check... If we have an in hand kong, place it.
		if (config.charleston === false) {
			breakdown.contents.forEach((item => {
				if (item.amount === 4) {
					strategy.throw = new Array(4).fill(item.getComponentTile())
				}
			}))
		}

		breakdown.strategy = strategy
		return breakdown
	}

	function getCharlestonTiles() {
		let tiles = []
		for (let i=0;i<3;i++) {
			let breakdown = computeHandBreakdown(currentHand.contents, currentHand.wind, {chooseSecondarySuit: Boolean(i%2), looseTileCost: 2, charleston: true}) //TODO: Base looseTileCost off of round.
			let strategy = breakdown.strategy
			currentHand.removeMatchingTile(strategy.throw)
			tiles.push(strategy.throw)
		}
		tiles.forEach((tile) => {currentHand.add(tile)})
		return tiles
	}

	if (gameData.charleston) {
		//We need to choose 3 tiles.
		placeTiles(getCharlestonTiles())
	}
	else if (gameData.currentTurn.userTurn === this.clientId) {
		//We need to choose a discard tile.
		//TODO: We need to check if we should, and can, charleston (as of, we are east).

		let breakdown = computeHandBreakdown(currentHand.contents, currentHand.wind, {chooseSecondarySuit: false, looseTileCost: 5})
		placeTiles(breakdown.strategy.throw)
	}
	else if (gameData.currentTurn.thrown) {
		//We need to evaluate if we pick up the thrown tile.

		currentHand.add(gameData.currentTurn.thrown)
		let isMahjong = currentHand.isMahjong()
		let tile = gameData.currentTurn.thrown
		//TODO: Look at keeping for sequence.
		if (currentHand.removeMatchingTilesFromHand(tile, 4, true)) {
			currentHand.remove(gameData.currentTurn.thrown)
			return placeTiles(new Array(4).fill(gameData.currentTurn.thrown), isMahjong)
		}
		if (currentHand.removeMatchingTilesFromHand(tile, 3, true)) {
			currentHand.remove(gameData.currentTurn.thrown)
			return placeTiles(new Array(3).fill(gameData.currentTurn.thrown), isMahjong)
		}
		if (isMahjong && currentHand.removeMatchingTilesFromHand(tile, 2, true)) {
			currentHand.remove(gameData.currentTurn.thrown)
			return placeTiles(new Array(2).fill(gameData.currentTurn.thrown), isMahjong)
		}
		//TODO: Look at making sequence.

		//Nothing we can do. Next.
		currentHand.remove(gameData.currentTurn.thrown)
		placeTiles([])
	}
}

module.exports = evaluateNextMove
