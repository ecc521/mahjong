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

class BlocklessAlert {
	constructor(messageText, duration = 4000) {
		let cover = document.createElement("div")
		cover.classList.add("blocklessAlertCover")
		document.body.appendChild(cover)

		let message = document.createElement("p")
		message.innerHTML = messageText
		window.requestAnimationFrame(function() {
			cover.style.opacity = 1
		})
		setTimeout(function() {
			cover.style.transition = "opacity " + duration/1000 + "s"
			cover.style.opacity = 0
			setTimeout(function() {cover.remove()}, duration)
		}, Number(window.getComputedStyle(cover).transition.match(/opacity\s(\d+[.]\d+)s/)[1]) * 1000)

		cover.appendChild(message)
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
