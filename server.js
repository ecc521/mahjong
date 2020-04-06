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


function getMessage(type, message) {
	return JSON.stringify({
		type: "error",
		message
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
			return websocket.send(errorMessage("Message must be valid JSON"))
		}

		console.log('received: ' + JSON.stringify(obj));

		if (!obj.clientId) {
			return websocket.send(JSON.stringify({
				type: "error",
				message: "No clientId specified. "
			}))
		}
		else {
			if (!clientId) {
				clientId = obj.clientId
			}
			else if (clientId !== obj.clientId) {
				return websocket.send(errorMessage("clientId changed"))
			}
		}


		//Now we have clientId, which allows us to identify an individual client.
		if (obj.type = "createRoom") {
			if (typeof obj.roomId !== "string" || obj.roomId.length < 5) {
				return websocket.send(errorMessage("roomId must be a string with length of at least 5"))
			}
			else if (rooms[obj.roomId]) {
				return websocket.send(errorMessage("Room already exists"))
			}


			websocket.send(JSON.stringify({
				type: "roomCreated",
				roomId: obj.roomId
			}))
		}
		else if (obj.type = "joinRoom") {
			if (!rooms[obj.roomId]) {
				return websocket.send(JSON.stringify({
					type: "error",
					message: "Room does not exist. "
				}))
			}

			websocket.send(JSON.stringify({
				type: "roomJoined",
				roomId: obj.roomId
			}))
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
