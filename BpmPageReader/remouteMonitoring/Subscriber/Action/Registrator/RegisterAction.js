define("RegisterAction", ["RegisterConfig"], function(config) {
	return {
		init: function() {
			registerAction(config.getActions(), connector);
		},
		registerAction: function(actions, connector) {
			console.log("Register Action");
			$(document).ready(function() {
				actions.forEach(function(item) {
					console.log(item.selector);
					console.log($(item.selector));
					$(item.selector).on("click", item.action.bind(null, connector));
				});
			});
		}
	};
});


