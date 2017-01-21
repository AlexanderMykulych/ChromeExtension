define("HelperModule", [], function() {
	return {
		getTabId: function(connector, callback) {
			connector.sendObj({
				subject: "GetTabId"
			}, callback);
		},
		getNetworkSelector: function(connector, callback) {
			connector.sendObj({
				subject: "GetNetworkSelector"
			}, callback, null, null, {
				msgType: "to-server"
			});
		}
	}
});