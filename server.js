const fs = require("fs")
const path = require("path")
const http = require("http")
const WebSocket = require('ws');
const crypto = require('crypto'); //For admin auth.

const hostname = "0.0.0.0"
const httpport = 7591

const serverDataDirectory = path.join(__dirname, "server", "data")
if (!fs.existsSync(serverDataDirectory)) {fs.mkdirSync(serverDataDirectory, {recursive: true})}

const httpserver = http.createServer();
const websocketServer = new WebSocket.Server({
	server: httpserver,
	//TODO: How to test if permesssage-deflate is actually working? Not seeing it in consoles.
	//Also, our current messages are insanely large, as we send all state, not just changes (meaning ~6KB, not ~200 bytes per message). Compression should get this down to
	//a few hundred bytes though, especially if window is carried over between messages.
	perMessageDeflate: {
	  threshold: 150, // Size (in bytes) below which messages should not be compressed.
	  memLevel: 9,
		level: 9,
		serverMaxWindowBits: 15,
	}
});

const Wall = require("./src/Wall.js")
const Tile = require("./src/Tile.js")
const Room = require("./server/Room.js")
const Client = require("./server/Client.js")
const StateManager = require("./server/StateManager.js")

global.stateManager = new StateManager()
global.stateManager.serverDataDirectory = serverDataDirectory
if (process.argv.includes("--loadState")) {
	let filePath = process.argv[process.argv.indexOf("--loadState") + 1]
	if (filePath) {
		let inputPath = path.join(serverDataDirectory, filePath) + ".server.json"
		console.log("Loading state from " + inputPath)
		global.stateManager.init(fs.readFileSync(inputPath))
	}
}

function getMessage(type, message, status) {
	return JSON.stringify({
		type, message, status
	})
}

websocketServer.on('connection', function connection(websocket) {
	let clientId;

	websocket.on('message', function incoming(message) {
		try {

			let obj;
			try {
				obj = JSON.parse(message)
			}
			catch(e) {
				return websocket.send(getMessage("error", "Message must be valid JSON"))
			}

			console.log('received: ' + JSON.stringify(obj));

			//Admin actions for triggering maintenance.

			//Example:
			//stateManager.callServerSave(password, "update")
			//stateManager.messageAllServerClients(password, "Server Update", "Mahjong 4 Friends is shutting down to perform a server update. \nIf all goes well, nothing will be lost, and we should be back up within a minute. Your device should automatically reconnect. ")

			//Then apply the update, and start the server loading from the state.
			//That should probably be done by editing crontab before reboot, then editing back.

			//stateManager.messageAllServerClients(password, "Reconnected", "Mahjong 4 Friends is back up. You may need to reload your page or restart the app, and your game might have gone back a turn or two. Please report any issues to support@mahjong4friends.com")


			if (obj.type === "callServerSave" || obj.type === "messageAllServerClients") {
				if (!obj.auth) {
					return websocket.send(getMessage("displayMessage", {title: "Auth Error", body: "This command must be authed"}, "error"))
				}

				let hash = crypto.createHash("sha256").update(obj.auth).digest("hex")
				if (hash !== "014eea3157474ede4dccc818d1a84efff650b82b8d67d3470f46e4ecc2f5d829") {
					return websocket.send(getMessage("displayMessage", {title: "Auth Error", body: "Invalid Admin Password"}, "error"))
				}

				if (obj.type === "callServerSave") {
					return websocket.send(getMessage("displayMessage", {title: "Server Save", body: saveServerState(obj.saveName)}, "error"))
				}
				else if (obj.type === "messageAllServerClients") {
					global.stateManager.getAllClients().forEach((client) => {
						client.message("displayMessage", {title: obj.title, body: obj.body}, "error")
					})
				}
				return;
			}


			let client;
			if (!clientId && !obj.clientId) {
				return websocket.send(getMessage("error", "No clientId specified"))
			}
			else {
				clientId = obj.clientId
				if (!global.stateManager.getClient(clientId)) {
					if (clientId.startsWith("bot")) {
						//Intended for dev use.
						client = global.stateManager.createBot(clientId, websocket)
					}
					else {
						client = global.stateManager.createClient(clientId, websocket)
					}
				}
				else {
					client = global.stateManager.getClient(clientId)
					client.setWebsocket(websocket)
				}
			}

			if (obj.type === "createRoom") {
				if (typeof obj.roomId !== "string" || obj.roomId.trim().length === 0) {
					return websocket.send(getMessage("createRoom", "roomId must be a string with at least one character", "error"))
				}
				else if (global.stateManager.getRoom(obj.roomId)) {
					return websocket.send(getMessage("createRoom", "Room Already Exists", "error"))
				}
				else {
					client.setNickname(obj.nickname)
					global.stateManager.createRoom(obj.roomId).addClient(clientId)
					client.setRoomId(obj.roomId)
					return websocket.send(getMessage("createRoom", obj.roomId, "success"))
				}
			}
			else if (obj.type === "joinRoom") {
				if (!global.stateManager.getRoom(obj.roomId)) {
					return websocket.send(getMessage("joinRoom", "Room Does Not Exist", "error"))
				}
				client.setNickname(obj.nickname)
				let status = global.stateManager.getRoom(obj.roomId).addClient(clientId)
				if (status === true) {
					client.setRoomId(obj.roomId)
					return websocket.send(getMessage("joinRoom", obj.roomId, "success"))
				}
				else {
					return websocket.send(getMessage("joinRoom", status, "error"))
				}
			}
			else if (obj.type === "getCurrentRoom") {
				console.log(client.getRoomId())
				let roomId = client.getRoomId()
				client.message(obj.type, roomId, "success")
				return websocket.send(getMessage(obj.type, roomId, "success"))
			}
			else if (obj.type === "createRoomFromState") {
				//Intended for developer use.
				try {
					let roomFilePath = path.join(serverDataDirectory, obj.saveId + ".room")

					if (fs.existsSync(roomFilePath)) {
						//Technically roomPath could be a ../ path, however this kind of "hacking" shouldn't do any damage here. We don't write or expose non-mahjong data.
						let room = Room.fromJSON(fs.readFileSync(roomFilePath, {encoding: "utf8"}))
						let roomId = room.roomId
						if (!global.stateManager.createRoom(roomId, room)) {return console.warn("Room already exists. ")}
						room.init()
					}
					else {console.warn("Invalid save path")}
				}
				catch(e) {console.error(e)}
				return;
			}
			else if (obj.type.includes("roomAction")) {
				//The user is in a room, and this action will be handled by the room.
				let room = global.stateManager.getRoom(obj.roomId) || client.getRoom()
				if (!room) {
					//The user did not specify a valid room to use, and was not in a room.
					return websocket.send(getMessage(obj.type, "Room Does Not Exist", "error"))
				}
				//console.log(room)
				try {
					return room.onIncomingMessage(clientId, obj)
				}
				catch(e) {
					console.error(e)
					console.error(e.stack)
					return;
				}
			}

			console.log("Nothing happened. ")
		}
		catch(e) {
			//Uncaught exceptions now cause server to crash since NodeJS update.
			console.error(e)
		}
	});
});


function saveServerState(filePath) {
	let outputPath = path.join(serverDataDirectory, filePath + ".server.json")
	fs.writeFileSync(outputPath, stateManager.toJSON())
	return "State saved to " + outputPath
}

process.stdin.on("data", function(data) {
	let command = data.toString()
	if (command.startsWith("save ")) {
		let filePath = command.trim().slice(5)
		console.log(saveServerState(filePath))
	}
})



try {
	httpserver.listen(httpport, hostname, () => {
	  console.log(`Server running at http://${hostname}:${httpport}/`);
	});
}
catch(e) {
	console.error(e)
}
