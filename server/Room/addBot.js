function addBot(obj) {
	//Create a clientId for the bot.
	let clientId = "bot" + (Math.random() * 2**53)

	client = global.stateManager.createBot(clientId)

	if (obj.botName) {client.setNickname(obj.botName)}
	client.setRoomId(this.roomId)

	this.addClient(clientId)
	this.sendStateToClients()
}

module.exports = addBot
