define("NetworkInfo", ["NetworkUtil", "ViewHelper"], function(networkUtil, viewHelper) {
	return {
		action: function(connector){
			Materialize.toast('Try Debug!', 3000);
			this.getTabId(connector, function(tabMessage) {
				$("#network-visualization").empty();
				$("#network-method-visualization").empty();
				networkUtil.startWatch(tabMessage.result, function(data) {
					viewHelper.generateNetworkView(data);
				}, function() {
					Materialize.toast('Debugger Connected!', 3000);
				});
				$("div#page-structure a#stop-statistic").on("click", function() {
					if(networkUtil) {
						networkUtil.stopWatch();
					}
				})
			});
		},
		getTabId: function(connector, callback) {
			connector.sendObj({
				subject: "GetTabId"
			}, callback);
		}
	};
});