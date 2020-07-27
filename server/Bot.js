const Client = require("./Client.js")

class Bot extends Client {
	constructor(clientId) {
		super(clientId)

		this.isBot = true

		this.evaluateNextMove = require("./Bot/evaluateNextMove.js").bind(this)

		let _message = this.message //So we don't lose access to the websocket based sending.

		let lastSent;
		this.message = (function message(type, message, status) {
			if (this.websocket) {
				//Bot being manually controlled.
				_message(type, message, status)
			}

			if (type === "roomActionState") {
				//This should be the only type of message we need to listen to.
				try {
					this.evaluateNextMove()
				}
				catch (e) {
					console.log("FATAL BOT ERROR: " + e)
					console.log(e.stack)
					//Only send the message once every 60 seconds at most.
					if (!lastSent || Date.now() - lastSent > 60*1000) {
						lastSent = Date.now()
						this.getRoom().messageAll([this.clientId], "roomActionPlaceTiles", `${this.clientId} has encountered an error, which affects this turn, and possibly successive ones. You can manually control the bot <a target="_blank" href="?clientId=${this.clientId}">here</a>. This message will be sent for the first error every minute. `, "error")
					}
				}
			}
			if (status === "error") {console.error("Bot received an error message: " + message)}
		}).bind(this)
	}
}

module.exports = Bot
