define("ModuleRegistrator", ["underscore"], function(_) {
	var moduleCount = 0;
	var jQuery = $;
	var moduleRegistrator = {
		register: function(moduleConfig, captionSelector, contentSelector, connector) {
			var name = moduleConfig.moduleName;
			var caption = moduleConfig.caption;
			var scope = this;
			require([name], function(module) {
				var selector = scope.createNewTab(captionSelector, contentSelector, caption);
				module.renderSettings = {
					selector: selector
				};
				module.init(connector);
			});
		},
		createNewTab: function(captionSelector, contentSelector, caption) {
			moduleCount++;
			var $ = jQuery;
			$(captionSelector).append('<li class="tab col s6"><a href="#module_' + moduleCount + '" class="active">'+ caption + '</a></li>');
			$(contentSelector).append('<div id=module_' + moduleCount + '></div>');
			$('ul.tabs').tabs();
			return contentSelector + " div#module_" + moduleCount;
		}
	};
	return moduleRegistrator;
});