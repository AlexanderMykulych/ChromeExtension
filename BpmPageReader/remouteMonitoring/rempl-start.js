function injectScript(file, node) {
	var th = document.getElementsByTagName(node)[0];
	var s = document.createElement('script');
	s.setAttribute('type', 'text/javascript');
	s.setAttribute('src', file);
	s.setAttribute('charset', 'utf-8');
	th.appendChild(s);
}
function OnMessageRecived(message) {
	var id = message.id;
	var info = message.result;
	if(actions[info.subject]) {
		actions[info.subject](message, function(result) {
			publisher.sendObj(result, null, null, id);
		});
	}
}
if(!publisher || !publisher.readyToUse) {
	var publisher = CreatePublisher("Test", null, null, OnMessageRecived);
}
var actions = {
	CardInfo: function(message, callback) {
		debugger;
		var pageInfoAction = new PageInfoAction();
		callback(pageInfoAction.getInfo());
	},
	Network: function(message, callback) {
		var networkUtil = new NetworkUtil();
		networkUtil.startWatch(function(data) {
			callback(data);
		});
	},
	GetTabId: function(message, callback) {
		callback(window["ExtensionTabId"]);
	},
	StructureInfo: function(message, callback) {
		var structureInfoAction = new StructureInfoAction();
		callback(structureInfoAction.getInfo());
	}
};