define("NetworkUtil", [], function() {
	return {
		startWatch: function(tabId, callback, onConnected) {
			var scope = this;
			scope.networkActivity = {};
			var version = "1.2";
			this.tabId = tabId;
			this.ReturnResult = callback;
			this.ReturnResult.bind(this);
			chrome.debugger.attach({tabId:tabId}, version,function() {
				chrome.debugger.sendCommand({tabId:tabId}, "Runtime.enable");
				chrome.debugger.sendCommand({tabId:tabId}, "Network.enable", function() {
					console.log(arguments);
					onConnected();
				});
				chrome.debugger.onEvent.addListener(onEvent);
			});
			window.addEventListener("unload", function() {
				chrome.debugger.detach({tabId:tabId});
			});
			function onEvent(debuggeeId, message, params) {
				if (tabId != debuggeeId.tabId)
					return;
				console.log(message);
				console.log(params);
				if(message.startsWith("Network.")) {
					var requestId = params.requestId;
					switch(message) {
						case "Network.requestWillBeSent":
						scope.networkActivity[requestId] = {"requestWillBeSent": params};
						break;
						case "Network.responseReceived":
						scope.networkActivity[requestId]["responseReceived"] = params;
						break;
						case "Network.dataReceived":
						scope.networkActivity[requestId]["dataReceived"] = params;
						break;
						case "Network.loadingFinished":
						scope.networkActivity[requestId]["loadingFinished"] = params;
						break;
						case "Network.responseReceived":
						scope.networkActivity[requestId]["responseReceived"] = params;
						break;
						case "Network.loadingFinished":
						scope.networkActivity[requestId]["loadingFinished"] = params;
						break;
					}
				}
			}
		},
		stopWatch: function() {
			if(this.tabId > 0) {
				chrome.debugger.detach({tabId:this.tabId});
				// this.ReturnResult(this.networkActivity);
				var result = this.processNetworkActivity();
			}
		},
		processNetworkActivity: function() {
			var requestCount = 0;
			var allFrames = [];
			for(var requestId in this.networkActivity) {
				requestCount++;
				Array.prototype.push.apply(allFrames, this.getRequestCallStack(this.networkActivity[requestId]));
			}
			this.ReturnResult(this.getStatistic(allFrames));
		},
		getRequestCallStack: function(request) {
			var eventName = "requestWillBeSent";
			var resultStack = [];
			if (request[eventName]) {
				var eventData = request[eventName];
				if(eventData.initiator && eventData.initiator.type === "script") {
					var callFrames = eventData.initiator.stack.callFrames;
					for(var index in callFrames) {
						var callFrame = callFrames[index];
						callFrame["requestUrl"] = eventData.request.url;
						resultStack.push(callFrame);
					}
				}
			}
			return resultStack;
		},
		getStatistic: function(frames) {
			return $linq(frames)
				.groupBy(x => x.url, x => x)
				.select((x, fileIndex) => {
					if(x.values.length > 0) {
						return {
							fileIndex: fileIndex,
							fileUrl: x.key,
							count: x.values.length,
							methods: $linq(x.values)
										.groupBy(y => (!y.functionName ? "anonymous" : y.functionName) + ":" + y.lineNumber + ":" +  y.columnNumber, y => y)
										.select(y => {
											return {
												name: y.key,
												count: y.values.length,
												requestedUrl: $linq(y.values).select(z => z.requestUrl).toArray()
											}
										})
										.toArray()
						};
					}
					return {
						fileUrl: x.key,
						count: 0,
						methods: null
					};
				})
				.where(x => x != null)
				.toArray();
		}
	};
});