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
global.stateManager = new StateManager()

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
			if (!clientId) {
				clientId = obj.clientId
				if (!global.stateManager.getClient(clientId)) {
					global.stateManager.createClient(clientId, websocket)
				}
			}
			else if (clientId !== obj.clientId) {
				return websocket.send(getMessage("error", "clientId changed"))
			}
		}

		if (obj.type === "createRoom") {
			if (typeof obj.roomId !== "string" || obj.roomId.length < 5) {
				return websocket.send(getMessage("createRoom", "roomId must be a string with length of at least 5", "error"))
			}
			else if (global.stateManager.getRoom(roomId)) {
				return websocket.send(getMessage("createRoom", "Room Already Exists", "error"))
			}
			else {
				global.stateManager.createRoom(roomId, clientId)
				return websocket.send(getMessage("createRoom", roomId, "success"))
			}
		}
		else if (obj.type === "joinRoom") {
			if (!global.stateManager.getRoom(roomId)) {
				return websocket.send(getMessage("joinRoom", "Room Does Not Exist", "error"))
			}
			global.stateManager.getRoom(roomId).addClient(clientId)
			return websocket.send(getMessage("joinRoom", roomId, "success"))
		}
		else if (obj.type.includes("roomAction")) {
			//The user is in a room, and this action will be handled by the room.
			let room = global.stateManager.getRoom(roomId)
			if (!room) {
				return websocket.send(getMessage(obj.type, "Room Does Not Exist", "error"))
			}
			room.incomingMessage(clientId, obj)
		}
	});
});


try {
	httpserver.listen(httpport, hostname, () => {
	  console.log(`Server running at http://${hostname}:${httpport}/`);
	});
}
catch(e) {
	console.error(e)
}
