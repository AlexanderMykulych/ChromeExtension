define("RegisterConfig", ["ModuleInfo", "NetworkInfo"], function(moduleInfo, networkInfo) {
	return {
		getActions: function() {
			return [
				{
					selector: "div#info #info",
					action: function(connector) {
						var pageInfo = new PageInfo(connector);
						pageInfo.getInfo(function(data) {
							var captionsMap = [{
								name: "href",
								caption: "Url"
							}, {
								name: "pageName",
								caption: "Название карточки"
							}, {
								name: "webSocketUrl",
								caption: "WebSocket url"
							}];
							viewHelper.generatePageInfoTable(data.result, captionsMap);
						});
					}
				},
				{
					selector: "div button#moduleInfo",
					action: moduleInfo.action
				},
				{
					selector: "div#page-structure a#statistic",
					action: networkInfo.action,
					scope: networkInfo
				}
			];
		},
		GetEntityInfo: function(connector) {

		},
		getTabId: function(callback) {
			subscriber.sendObj({
				subject: "GetTabId"
			}, callback);
		},
		GetNetworkStatistic: function(connector) {
			Materialize.toast('Try Debug!', 3000);
			getTabId(function(tabMessage) {
				$("#network-visualization").empty();
				$("#network-method-visualization").empty();
				var networkUtil = new NetworkUtil();
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
		}
	}
});