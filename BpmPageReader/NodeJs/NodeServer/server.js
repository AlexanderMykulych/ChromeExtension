var http = require('http');
var Static = require('node-static');
var WebSocketServer = new require('ws');
var cSubscriberName = "subscriber";
var cPublisherName = "publisher";
// подключенные клиенты
var clients = {};
var clientsInfo = [];
// WebSocket-сервер на порту 8081
var webSocketServer = new WebSocketServer.Server({port: 8081, perMessageDeflate: false});
webSocketServer.on('connection', function(ws) {
	var id = Math.random();
	clients[id] = ws;
	console.log("новое соединение " + id);
	ws.on('message', function(message) {
		console.log('получено сообщение ' + message);
		var msg = JSON.parse(message);
		switch(msg.type) {
			case "init":
				initClient(id, msg);
			break;
			case "message-to-subscribers":
				for(var i in clientsInfo) {
					var clientInfo = clientsInfo[i];
					var info = clientInfo.info;
					if(info.type === cSubscriberName && info.key === msg.info.key) {
						clientInfo.connection.send(msg.info.text);
					}
				}
			break;
			case "message-to-publisher":
				for(var i in clientsInfo) {
					var clientInfo = clientsInfo[i];
					var info = clientInfo.info;
					if(info.type === cPublisherName && info.key === msg.info.key) {
						clientInfo.connection.send(msg.info.text);
					}
				}
			break;
			case "to-server":
				var fs = require("fs");
				var text = fs.readFileSync("Network/Selectors.json", "utf8");
				console.log("selectors:");
				console.log(text);
				var textObj = JSON.parse(msg.info.text);
				for(var i in clientsInfo) {
					if(clientsInfo[i].id == id) {
						clientsInfo[i].connection.send(JSON.stringify({
							id: textObj.id,
							result: text
						}));
					}
				}
			break;
		}
	});
	ws.on('close', function() {
		console.log('соединение закрыто ' + id);
		var removeIndex = -1;
		clientsInfo.find(function(item, index) {
			if(item.id === id) {
				removeIndex = index;
				return true;
			}
		})
		if(removeIndex > -1) {
			console.log("remove: " + removeIndex);
			clientsInfo.splice(removeIndex, 1);
		}
		console.log("delete: " + id);
		delete clients[id];
	});
});
// обычный сервер (статика) на порту 8080
var fileServer = new Static.Server('.');
http.createServer(function (req, res) {
	fileServer.serve(req, res);
}).listen(8080);

console.log("Сервер запущен на портах 8080, 8081");

function initClient(id, msg) {
	if(msg.info) {
		clientsInfo.push({
			id: id,
			info: msg.info,
			connection: clients[id]
		});
	}
}

