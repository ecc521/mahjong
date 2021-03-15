function addBot(obj) {
	//Create a clientId for the bot.
	let client = global.stateManager.createBot()

	if (obj.botName) {client.setNickname(obj.botName)}
	client.setRoomId(this.roomId)

	this.addClient(client.clientId)
	this.sendStateToClients()
}

module.exports = addBot
