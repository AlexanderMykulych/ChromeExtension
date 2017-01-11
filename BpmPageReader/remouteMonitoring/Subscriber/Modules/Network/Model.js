define("network/model", ["backbone", "HelperModule", "linq"], function(Backbone, helper, $linq) {
	var networkModel = Backbone.Model.extend({
		defaults: {
			networkActivity: {},
			tabId: -1,
			id: 0,
			debuggerVersion: "1.2"
		},
		stopGetStatistic: function() {
			debugger;
			chrome.debugger.detach({tabId: this.tabId});
		},
		getStatistic: function() {
			var scope = this;
			helper.getTabId(this.get("connector"), function(tabMessage) {
				var tabId = tabMessage.result;
				scope.tabId = tabId;
				scope.activateRuntimeAndNetwork(tabId, scope.onDebuggerEvent.bind(scope));
			});
		},
		activateRuntimeAndNetwork: function(tabId, onEvent) {
			chrome.debugger.attach({tabId:tabId}, this.get("debuggerVersion"),function() {
				chrome.debugger.sendCommand({tabId:tabId}, "Runtime.enable");
				chrome.debugger.sendCommand({tabId:tabId}, "Network.enable");
				chrome.debugger.onEvent.addListener(onEvent);
				window.addEventListener("unload", function() {
					this.stopGetStatistic();
				});
			});
		},
		onDebuggerEvent: function(debuggeeId, message, params) {
			if (this.tabId != debuggeeId.tabId)
				return;
			if(message.startsWith("Network.")) {
				var requestId = params.requestId;
				var networkActivity = _.clone(this.get("networkActivity"));
				switch(message) {
					case "Network.requestWillBeSent":
					networkActivity[requestId] = {"requestWillBeSent": params};
					break;
					case "Network.responseReceived":
					networkActivity[requestId]["responseReceived"] = params;
					break;
					case "Network.dataReceived":
					networkActivity[requestId]["dataReceived"] = params;
					break;
					case "Network.loadingFinished":
					networkActivity[requestId]["loadingFinished"] = params;
					break;
					case "Network.responseReceived":
					networkActivity[requestId]["responseReceived"] = params;
					break;
					case "Network.loadingFinished":
					networkActivity[requestId]["loadingFinished"] = params;
					break;
				}
				this.set("networkActivity", networkActivity);
				var onAddCallback = this.get("onAddActivityCallback");
				if(onAddCallback) {
					onAddCallback(requestId);
				}
			}
		}
	});
	return networkModel;
});