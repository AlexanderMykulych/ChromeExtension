define("RegisterAction", ["ModuleConfig", "ModuleRegistrator"], function(moduleConfig, registrator) {
	return {
		init: function(connector) {
			var config = moduleConfig.config();
			for(var i in config) {
				registrator.register(config[i], "div.container .tabs", "div.container .row.tabscontent>div", connector);
			}
		},
		onMessageRecived: function() {

		}
	};
});


