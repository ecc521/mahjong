class Notification {
	constructor(errorText, messageText) {
		messageText = messageText.split("\n").join("<br>")

		let cover = document.createElement("div")
		cover.id = "errorPopupCover"
		cover.style.display = "none"
		document.body.appendChild(cover)

		let popup = document.createElement("div")
		popup.id = "errorPopup"
		cover.appendChild(popup)

		let error = document.createElement("p")
		error.innerHTML = errorText
		error.id = "errorText"
		popup.appendChild(error)

		let message = document.createElement("p")
		message.innerHTML = messageText
		message.id = "messageText"
		popup.appendChild(message)

		let dismissButton = document.createElement("button")
		dismissButton.id = "dismissButton"
		dismissButton.innerHTML = "Dismiss"
		popup.appendChild(dismissButton)

		let dismiss = (function dismiss(ev) {
			if (this.ondismissed) {this.ondismissed()}
			cover.remove()
		}).bind(this)

		//Prevent people from accidentally closing the message before they can read it.
		setTimeout(function() {
			dismissButton.addEventListener("click", dismiss)
			cover.addEventListener("click", function(event) {
				if (event.target === cover) {dismiss()}
			})
		}, 500)

		this.show = function() {
			cover.style.display = ""
		}
	}
}

let previousMessagePromise = new Promise((resolve) =>{resolve()});
let counter = 0

class BlocklessAlert {
	constructor(messageText, duration = 3200) {
		let cover = document.createElement("div")
		cover.classList.add("blocklessAlertCover")
		cover.style.display = "none"
		document.body.appendChild(cover)

		let message = document.createElement("p")
		message.innerHTML = messageText
		cover.appendChild(message)

		let onStart = previousMessagePromise
		previousMessagePromise = new Promise((resolve) => {
			counter++
			previousMessagePromise.then(() => {
				console.log(counter + " messages remaining to be posted. ")
				//Exponentation be below 1, or NaN, so be careful to assure newDuration is no longer. Also, clamp to max speedup of 3x (currently 15 left)
				let newDuration = duration / Math.min((Math.max(1, counter ** 0.4) || 1), 3)
				console.log(`Adjusting duration from ${duration} to ${newDuration}`)
				duration = newDuration
				cover.style.animation = "fadeInAndOut " + duration + "ms ease-in"
				cover.style.display = ""
				setTimeout(function() {
					cover.remove()
					counter--
					resolve()
				}, duration)
			})
		})

		let onEnd = previousMessagePromise
		return {
			onStart,
			onEnd
		}
	}
}


class MessageBar {
	constructor(text) {
		let bar = document.createElement("div")
		bar.id = "notificationBar"

		let textHolder = document.createElement("p")
		textHolder.innerHTML = text
		bar.appendChild(textHolder)

		this.show = function(duration) {
			document.body.appendChild(bar)
			setTimeout(function() {
				bar.remove()
			}, duration)
		}
	}
}

module.exports = {
	Notification,
	MessageBar,
	BlocklessAlert
}
