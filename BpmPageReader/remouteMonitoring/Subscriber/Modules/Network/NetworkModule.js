define("NetworkModule", ["network/model", "network/view"], function(modelConfig, viewConfig) {
	return {
		init: function(connector) {
			this.$el = $(this.renderSettings.selector);
			//TODO: Доделать загрузку и инициализацию модели и представления
			var model = new modelConfig({
				connector: connector
			});
			var view = new viewConfig({
				selector: this.renderSettings.selector,
				model: model
			});
			this.$el.html(view.render().el);
		},
		initButtonBind: function() {
			this.$el.find("#statistic").on("click", this.model.statistic);
			this.$el.find("#stop-statistic").on("click", this.model.stopStatistic);
		}
	}
});