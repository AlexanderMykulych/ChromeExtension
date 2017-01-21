function Connector(type, key, host, port, onMessageRecived, onConnect, onDisconnect) {
	this.port = port || 8081;
	this.host = host || "localhost";
	this.key = key;
	this.type = type;
	this.socket = null;
	this.readyToUse = false;
	this.messages= [];
	this.socketQueueId = 0;
	this.onMessageRecived = onMessageRecived;
	this.tryConnect = function() {
		var socket = new WebSocket("ws://" + this.host + ":" + this.port);
		this.socket = socket;
		var scope = this;
		socket.onopen = function() {
			console.log("websocket open");
			if(onConnect) {
				onConnect();
			}
			scope.readyToUse = true;
			scope.sendStart();
		}
		socket.onclose = function() {
			console.log("websocket close");
			if(onDisconnect) {
				onDisconnect();
			}
			scope.readyToUse = false;
		}
		socket.onerror = function() {
			console.log("websocket error");
			scope.readyToUse = false;
		}
		socket.onmessage = function(event) {
			console.log(event.data);
			var msg = JSON.parse(event.data);
			var requestIndex = -1;
			var requestMessage = scope.messages.find(function(item, index) {
				if(item.id === msg.id && item.callback !== null) {
					requestIndex = index;
					return true;
				}
				return false;
			});
			if(requestIndex > -1) {
				scope.messages.splice(requestIndex, 1);
				if(requestMessage.callback) {
					requestMessage.callback.call(requestMessage.callbackScope, msg);
				}
			} else {
				scope.onMessageRecived(msg);
			}
		}
	}
	this.send = function(message, additionalInfo) {
		var socket = this.socket;
		var type = additionalInfo && additionalInfo.msgType ? additionalInfo.msgType : (this.type === "subscriber" ? "message-to-publisher" : "message-to-subscribers");
		if (socket && this.readyToUse) {
			socket.send(JSON.stringify({
				type: type,
				info: {
					type: this.type,
					key: this.key,
					text: message
				}
			}));
		}
	}
	this.sendObj = function(obj, callback, callScope, id, additionalInfo) {
		id = id || ++this.socketQueueId
		this.messages.push({
			id: id,
			message: obj,
			callback: callback,
			callbackScope: callScope
		});
		this.send(JSON.stringify({
			id: id,
			result: obj
		}), additionalInfo);
	}
	this.sendStart = function() {
		var socket = this.socket;
		if(socket && this.readyToUse) {
			socket.send(JSON.stringify({
				type: "init",
				info: {
					type: this.type,
					key: this.key
				}
			}));
		}
	}
	this.tryConnect();
}