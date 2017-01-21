define("network/model", ["backbone", "HelperModule", "linq", "NetworkSelectorModel", "NetworkSelectorView",
	"NetworkSelectorCollection", "underscore"],
function(Backbone, helper, $linq, model, view, collection, _) {
	return Backbone.Model.extend({
		defaults: {
			networkActivity: {},
			tabId: -1,
			id: _.uniqueId("NetworkModel_"),
			debuggerVersion: "1.2",
			SelectorResultData: []
		},
		initialize: function() {
			this.set("Selectors", new collection());
			this.set("ModelConstructor", model);
			this.set("ViewConstructor", view);
			this.set("selectorsSelector", "#selectors");
			this.getSelectors();
		},
		getSelectors: function() {
			var scope = this;
			helper.getNetworkSelector(this.get("connector"), function(data) {
				var selectorsData = JSON.parse(data.result);
				scope.set("NetworkSelectors", selectorsData.selectors);
				scope.createSelectors.bind(scope)();
			});
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
		},
		createSelectors: function() {
			var selectors = this.get("NetworkSelectors");
			var collection = this.get("Selectors");
			var modelCntr = this.get("ModelConstructor");
			var viewCntr = this.get("ViewConstructor");
			for(var i in selectors) {
				var item = selectors[i];
				var model = new modelCntr({
					name: item.name,
					query: item.query,
					params: item.params,
					getNetworkActivities: this.getNetworkActivities.bind(this)
				});
				collection.add(model);
			};
		},
		getNetworkActivities: function(query) {
			return _.map(this.get("networkActivity"), function(item, key) { return item; });
		}
	});
});