define("HelperModule", [], function() {
	return {
		getTabId: function(connector, callback) {
			connector.sendObj({
				subject: "GetTabId"
			}, callback);
		}
	}
});