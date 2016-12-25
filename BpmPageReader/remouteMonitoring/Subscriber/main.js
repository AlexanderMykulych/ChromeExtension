requirejs.config({
	paths: {
		"RegisterAction": "Action/Registrator/RegisterAction",
		"RegisterConfig": "Action/Registrator/RegisterConfig",
		"ModuleInfo": "Action/ModuleInfo/ModuleInfo",
		"StructureInfo": "Action/ModuleInfo/StructureInfo",
		"ViewHelper": "View/ViewHelper",
		"ViewTemplate": "View/ViewTemplate",
		"ViewNetworkHelper": "View/NetworkViewHelper",
		"NetworkInfo": "Action/NetworkInfo/NetworkInfo",
		"NetworkUtil": "../MonitoringModule/Network/NetworkUtil"
	}
});
String.format = function() {
	var s = arguments[0];
	for (var i = 0; i < arguments.length - 1; i++) {
		var reg = new RegExp("\\{" + i + "\\}", "gm");
		s = s.replace(reg, arguments[i + 1]);
	}
	return s;
};
require(["Subscriber", "RegisterAction"], function(subscriber, registrator) {
	var connector = subscriber.createSubscriber("Test", null, null, registrator.onMessageRecived);
	registrator.init(connector);
});