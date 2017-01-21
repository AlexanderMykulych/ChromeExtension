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
		"NetworkUtil": "../MonitoringModule/Network/NetworkUtil",
		"JQuery": "../../node_modules/jquery/dist/jquery",
		"underscore": "../../lib/Underscore/underscore",
		"text": "../../require/text",
		"ModuleConfig": "Action/Registrator/ModuleConfig",
		"ModuleRegistrator": "Action/Registrator/ModuleRegistrator",
		"NetworkModule": "Modules/Network/NetworkModule",
		"backbone": "../../lib/Backbone/backbone",
		"network/view": "Modules/Network/View",
		"network/model": "Modules/Network/Model",
		"HelperModule": "Modules/Helper/HelperModule",
		"linq": "utils/js/jslinq",
		"GraphicHelper": "Modules/Helper/GraphicHelper",
		"d3": "utils/js/d3",
		"d3Tip": "../../lib/d3-tip/index",
		"d3-selection": "../../lib/d3-selection/d3-selection",
		"d3-collection": "../../lib/d3-collection/d3-collection",
		"highcharts": "../../lib/highcharts/code/highcharts.src",
		"SelectArchive": "Modules/Network/SelectArchive",
		"NetworkSelectorModel": "Modules/Network/NetworkSelector/Model",
		"NetworkSelectorView": "Modules/Network/NetworkSelector/View",
		"NetworkSelectorCollection": "Modules/Network/NetworkSelector/Collection"
	},
	shim: {
		"underscore": {
			exports: '_'
		},
		"JQuery": {
			exports: "$"
		},
		"backbone": {
			deps: ["JQuery", "underscore"],
			exports: "Backbone"
		},
		"linq": {
			exports: "$linq"
		},
		"highcharts": {
			deps: ["JQuery"],
			exports: "Highcharts"
		}
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
	var connector = subscriber.createSubscriber("Test", null, null, registrator.onMessageRecived, function() {
		registrator.init(connector);
	});
});