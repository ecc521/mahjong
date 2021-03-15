const Sequence = require("../Sequence.js")
const Pretty = require("../Pretty.js")
const Wall = require("../Wall.js")
const Match = require("../Match.js")
const Tile = require("../Tile.js")
const Hand = require("../Hand.js")

function isMahjong(unlimitedSequences) {

	let maximumSequences = unlimitedSequences?4:1 //4 sequences is unlimited.

	//Returns 2 for mahjong, and 0 for not mahjong.
	//If the hand is not currently committed to mahjong, but is mahjong, a hand containing the organization resulting in mahjong will be returned.

	let pongOrKong = 0
	let pairs = 0
	let sequences = 0

	let remainingTiles = []
	let initialTiles = []
	for (let i=0;i<this.contents.length;i++) {
		let match = this.contents[i]
		if (match.isPongOrKong) {
			pongOrKong++
			initialTiles.push(match)
		}
		else if (match.isPair) {
			pairs++
			initialTiles.push(match)
		}
		else if (match.isSequence) {
			sequences++
			initialTiles.push(match)
		}
		else if (match instanceof Pretty) {
			initialTiles.push(match)
		}
		else {remainingTiles.push(match)}
	}

	if (pairs === 1) {
		if (Math.min(sequences, maximumSequences) + pongOrKong === 4) {return 2}
	}

	//Now we need to go through our remaining tiles.
	let allTiles = Hand.sortTiles(Wall.getNonPrettyTiles(1))
	let possibleMatches = []
	let possibleSequences = []
	let testingHand = new Hand()
	testingHand.contents = remainingTiles.slice(0)

	allTiles.forEach((tile) => {
		if (testingHand.removeMatchingTilesFromHand(tile, 3, true)) {
			possibleMatches.push(tile)
		}
	})

	//We might be able to have multiple copies of the same sequence.
	//TODO: This has potential to be very slow.
	allTiles.forEach((tile, index) => {
		if (!Sequence.isValidSequence(allTiles.slice(index, index+3))) {
			return;
		}

		let copies = 0
		let tiles = allTiles.slice(index, index+3)

		while (copies < maximumSequences)  {
			let testTiles = Array(copies + 1).fill(tiles).flat()
			if (testingHand.removeTilesFromHand(testTiles, true)) {
				copies++
			}
			else {break}
		}

		for (let i=0;i<copies;i++) {
			possibleSequences.push(new Sequence({
				exposed: false,
				tiles //Is it a problem using the same referenced tiles? And even further, do we need to create seperate sequence objects? I think not.
			}))
		}
	})

	//https://stackoverflow.com/questions/5752002/find-all-possible-subset-combos-in-an-array/39092843#39092843
	function* generateCombinations(arr, size) {
	  function* doGenerateCombinations(offset, combo) {
		if (combo.length == size) {
		  yield combo;
		} else {
		  for (let i = offset; i < arr.length; i++) {
			yield* doGenerateCombinations(i + 1, combo.concat(arr[i]));
		  }
		}
	  }
	  yield* doGenerateCombinations(0, []);
	}

	let combinations = []
	let allPossibilities = possibleMatches
	let neededPongEquivs = 4

	if (unlimitedSequences || sequences === 0) {
		allPossibilities = allPossibilities.concat(possibleSequences)
		neededPongEquivs -= sequences
	}
	else {
		neededPongEquivs -= Math.min(sequences, 1)
	}
	neededPongEquivs -= pongOrKong

	for (let combo of generateCombinations(allPossibilities, neededPongEquivs)) {
		//Remove all combos that result in too many sequences, or that are obviously impossible.
		let sequenceCount = combo.reduce((total, value) => {return total+Number(value instanceof Sequence)}, 0)
		let matchCount = neededPongEquivs - sequenceCount
		sequenceCount += sequences
		if (4-pongOrKong-matchCount > Math.min(maximumSequences, sequenceCount)) {
			continue;
		}
		combinations.push(combo);
	}

	console.log("Checking for mahjong from " + combinations.length + " combinations. ")

	//TODO: Now that we support stacked sequences, we could have multiple valid winning hands. We should handle this, and return all valid hands.
	combos:
	for (let i=0;i<combinations.length;i++) {
		let combo = combinations[i]
		let localTestHand = new Hand()
		localTestHand.contents = testingHand.contents.slice(0)
		for (let i=0;i<combo.length;i++) {
			let item = combo[i]
			if (item instanceof Tile) {
				if (!localTestHand.removeMatchingTilesFromHand(item, 3)) {
					continue combos; //Continue outer loop
				}
				localTestHand.add(new Match({type: item.type, value: item.value, exposed: false, amount: 3}))
			}
			else if (item instanceof Sequence) {
				if (!localTestHand.removeTilesFromHand(item)) {
					continue combos; //Continue outer loop
				}
				localTestHand.add(item)
			}
		}
		//Check for a pair
		let tile = (localTestHand.contents.filter((item) => {return item instanceof Tile}))[0]
		if (pairs === 0 && !localTestHand.removeMatchingTilesFromHand(tile, 2, true)) {
			continue;
		}
		else {
			if (pairs === 0) {
				localTestHand.add(new Match({type: tile.type, value: tile.value, exposed: false, amount: 2}))
				localTestHand.removeMatchingTilesFromHand(tile, 2)
			}
			localTestHand.contents = localTestHand.contents.concat(initialTiles.slice(0))
			return localTestHand
		}
	}
	return 0
}

module.exports = isMahjong
