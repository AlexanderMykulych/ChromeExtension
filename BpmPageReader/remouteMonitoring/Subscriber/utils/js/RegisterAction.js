define("RegisterAction", [], function() {
	var actions = [
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
			action: GetModuleInfo
		},
		{
			selector: "div#page-structure a#statistic",
			action: GetNetworkStatistic
		}
	];
	return {
		init: function() {

		}
	};
});

function GetEntityInfo(connector) {

}
function GetModuleInfo(connector) {
	var structureInfo = new StructureInfo(connector);
	structureInfo.getInfo(function(data) {
		viewHelper.generateStructureView(data.result);
	});
}
function getTabId(callback) {
	subscriber.sendObj({
		subject: "GetTabId"
	}, callback);
}
function GetNetworkStatistic(connector) {
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
var RegisterAction = function(connector) {
	console.log("Register Action");
	$(document).ready(function() {
		actions.forEach(function(item) {
			console.log(item.selector);
			console.log($(item.selector));
			$(item.selector).on("click", item.action.bind(null, connector));
		});
	});
}
