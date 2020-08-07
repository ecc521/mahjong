function SettingsMenu(settingsDiv) {
	//Construct header.
	let header = document.createElement("h2")
	header.innerHTML = "Game Settings"
	settingsDiv.appendChild(header)


	let options = {
		unlimitedSequences: new UnlimitedSequencesSelector(),
		charleston: new CharlestonSelector()
	}

	for (let option in options) {
		settingsDiv.appendChild(options[option].elem)
	}

	this.getChoices = function() {
		let obj = {}
		for (let option in options) {
			obj[option] = options[option].get()
		}
		return obj
	}
	this.setChoices = function(obj = {}) {
		for (let option in obj) {
			options[option].set(obj[option])
		}
	}
	this.setChoices() //Sets default choices.
}

function CharlestonSelector() {
	let elem = document.createElement("div")
	elem.id = "charlestonSelectorDiv"


	this.elem = elem

	this.get = function() {
		return ["right", "across", "left"]
	}
	this.set = function() {

	}
}

function UnlimitedSequencesSelector() {
	let elem = document.createElement("div")
	elem.id = "unlimitedSequencesSelectorDiv"

	let checkbox = document.createElement("input")
	checkbox.id = "unlimitedSequencesSelectorCheckbox"
	checkbox.type = "checkbox"

	let label = document.createElement("label")
	label.for = "unlimitedSequencesSelectorCheckbox"
	label.innerHTML = "Allow Unlimited Sequences (WARNING: Some minor bugs)"

	this.elem = elem
	elem.appendChild(checkbox)
	elem.appendChild(label)

	this.get = function() {
		return checkbox.checked
	}
	this.set = function(boolean = false) {
		checkbox.checked = boolean
	}
}


module.exports = SettingsMenu
