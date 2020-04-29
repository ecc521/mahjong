const fs = require("fs")
const path = require("path")
const http = require("http")
const WebSocket = require('ws');

const hostname = "0.0.0.0"
const httpport = 3000

const serverDataDirectory = path.join(__dirname, "server", "data")
if (!fs.existsSync(serverDataDirectory)) {fs.mkdirSync(serverDataDirectory, {recursive: true})}

const httpserver = http.createServer();
const websocketServer = new WebSocket.Server({server: httpserver});

const Wall = require("./src/Wall.js")
const Tile = require("./src/Tile.js")
const Room = require("./server/Room.js")
const Client = require("./server/Client.js")
const StateManager = require("./server/StateManager.js")


if (process.argv.includes("--loadState")) {
	let filePath = process.argv[process.argv.indexOf("--loadState") + 1]
	if (filePath) {
		let inputPath = path.join(serverDataDirectory, filePath) + ".mahjongServerState"
		console.log("Loading state from " + inputPath)
		global.stateManager = StateManager.fromJSON(fs.readFileSync(inputPath))
	}
}
else {
	global.stateManager = new StateManager()
}

function getMessage(type, message, status) {
	return JSON.stringify({
		type, message, status
	})
}

websocketServer.on('connection', function connection(websocket) {
	let clientId;

	websocket.on('message', function incoming(message) {
		let obj;
		try {
			obj = JSON.parse(message)
		}
		catch(e) {
			return websocket.send(getMessage("error", "Message must be valid JSON"))
		}

		console.log('received: ' + JSON.stringify(obj));

		if (!obj.clientId) {
			return websocket.send(getMessage("error", "No clientId specified"))
		}
		else {
			clientId = obj.clientId
			if (!global.stateManager.getClient(clientId)) {
				global.stateManager.createClient(clientId, websocket)
			}
			else {
				global.stateManager.getClient(clientId).setWebsocket(websocket)
			}
		}

		if (obj.type === "createRoom") {
			if (typeof obj.roomId !== "string" || obj.roomId.length < 5) {
				return websocket.send(getMessage("createRoom", "roomId must be a string with length of at least 5", "error"))
			}
			else if (global.stateManager.getRoom(obj.roomId)) {
				return websocket.send(getMessage("createRoom", "Room Already Exists", "error"))
			}
			else {
				global.stateManager.getClient(clientId).setNickname(obj.nickname)
				global.stateManager.createRoom(obj.roomId).addClient(clientId)
				global.stateManager.getClient(clientId).setRoomId(obj.roomId)
				return websocket.send(getMessage("createRoom", obj.roomId, "success"))
			}
		}
		else if (obj.type === "joinRoom") {
			if (!global.stateManager.getRoom(obj.roomId)) {
				return websocket.send(getMessage("joinRoom", "Room Does Not Exist", "error"))
			}
			global.stateManager.getClient(clientId).setNickname(obj.nickname)
			let status = global.stateManager.getRoom(obj.roomId).addClient(clientId)
			if (status === true) {
				global.stateManager.getClient(clientId).setRoomId(obj.roomId)
				return websocket.send(getMessage("joinRoom", obj.roomId, "success"))
			}
			else {
				return websocket.send(getMessage("joinRoom", status, "error"))
			}
		}
		else if (obj.type === "getCurrentRoom") {
			let roomId = global.stateManager.getClient(clientId).getRoomId()
			return websocket.send(getMessage(obj.type, roomId, "success"))
		}
		else if (obj.type.includes("roomAction")) {
			//The user is in a room, and this action will be handled by the room.
			let room = global.stateManager.getRoom(obj.roomId) || global.stateManager.getClient(clientId).getRoom()
			if (!room) {
				//The user did not specify a valid room to use, and was not in a room.
				return websocket.send(getMessage(obj.type, "Room Does Not Exist", "error"))
			}
			console.log(room)
			console.log(room.onIncomingMessage)
			return room.onIncomingMessage(clientId, obj)
		}

		console.log("Nothing happened. ")
	});
});


process.stdin.on("data", function(data) {
	let command = data.toString()
	if (command.startsWith("save ")) {
		let filePath = command.trim().slice(5) + ".mahjongServerState"
		let outputPath = path.join(serverDataDirectory, filePath)
		fs.writeFileSync(outputPath, stateManager.toJSON())
		console.log("State saved to " + outputPath)
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
