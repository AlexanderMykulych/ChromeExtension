define(["JQuery", "backbone", "underscore",
	"text!Modules/Network/NetworkSelector/SelectorItem.html",
	"text!Modules/Network/NetworkSelector/ParameterItem.html",
	"GraphicHelper"], function($, Backbone, _, template, paramHtml, graphicHelper) {
	return Backbone.View.extend({
		initialize: function(options) {
			this.options = options;
			this.startTemplate = _.template(template);
			this.paramTemplate = _.template(paramHtml);
			this.model.on("change:SelectorResultData", this.renderData.bind(this));
		},
		render: function() {
			this.$el.html(this.startTemplate(this.model.attributes));
			this.renderParams();
			this.delegateEvents(this.events());
			return this;
		},
		events: function() {
			var _events = {};
			if(this.model) {
				var aSelector = "click a#" + this.model.id;
				_events[aSelector] = "changeSelect";
			}
			return _events;
		},
		changeSelect: function(item) {
			this.model.executeQuery();
		},
		renderData: function() {
			var selectorResultData = this.model.get("SelectorResultData");
			if(_.isEmpty(selectorResultData)) {
				$(this.options.graphSelector).empty();
				$(this.options.paramSelector).empty();
				return;
			}
			this.renderParams();
			var categoryAndSeries = this.getCategoriesAndSeries(selectorResultData);
			var chartOption = {
				type: "horizontal-bar",
				caption: "Request Statistic",
				subtitle: "script",
				categories: categoryAndSeries.categories,
				xAxis: {
					text: "Method Name"
				},
				yAxis: {
					text: "Request Count"
				},
				series: categoryAndSeries.series,
				onClick: function(mouseEvent) {}
			};
			graphicHelper.generateGraphic($(this.options.graphSelector)[0].id, chartOption);
		},
		renderParams: function() {
			var params = this.model.get("params");
			var paramEl = $(this.options.paramSelector);
			paramEl.empty();
			if(params != null) {
				_.each(params, function(param) {
					paramEl.append(this.paramTemplate(param));
				}.bind(this));
			}
		},
		getCategoriesAndSeries: function(data) {
			var categories = $linq(data)
				.groupBy(x => x.name, x => x.name)
				.select(x => x.key)
				.toArray();
			var series = [{
				name: "script",
				data: $linq(data)
					.groupBy(x => x.name, x => x)
					.select(x => {
						var value = x.values[0];
						return {
							y: value.count,
							itemId: value.id
						}
					})
					.toArray()
				}];
			return {
				categories: categories,
				series: series
			};
		}
	});
});