define("network/view", ["backbone", "JQuery", "underscore", "text!Modules/Network/start.html", "GraphicHelper", "SelectArchive", "NetworkSelectorView"],
	function(Backbone, $, _, template, graphicHelper, selectArchive, viewCntr) {
	var networkView = Backbone.View.extend({
		statisticPropertyName: "ViewStatistic",
		initialize: function() {
			this.startTemplate = _.template(template);
			this.selectorsViews = [];
			this.initModelRenderedPropery();
			this.initOnAddNewActivityCallback();
			this.model.get("Selectors").bind("add", this.networkSelectorChanges.bind(this));
		},
		initModelRenderedPropery: function() {
			this.model.set(this.statisticPropertyName, {
				categories: [],
				series: []
			});
		},
		initOnAddNewActivityCallback: function() {
			this.model.set("onAddActivityCallback", this.onAddActivity.bind(this));
		},
		render: function() {
			console.log("render");
			this.$el.html(this.startTemplate(this.model));
			return this;
		},
		events: {
			"click #statistic": "onGetStatisticClick",
			"click #stop-statistic": "onStopGetStatisticClick",
		},
		onGetStatisticClick: function() {
			this.model.getStatistic();
		},
		onStopGetStatisticClick: function() {
			this.renderNetworkStatistic(this.model.get("networkActivity"));
			this.model.stopGetStatistic();
		},
		renderNetworkStatistic: function(activities) {
			var scope = this;
			selectArchive.select(activities, "default", {
				type: "script-request-count"
			}).then(result => {
				var categoryAndSeries = this.getCategoriesAndSeriesForBar(result);
				this.chartOption = {
					type: "horizontal-bar",
					caption: "File Statistic",
					subtitle: null,
					categories: categoryAndSeries.categories,
					xAxis: {
						text: "File Name"
					},
					yAxis: {
						text: "Request Count"
					},
					series: categoryAndSeries.series,
					onClick: function(mouseEvent) {
						scope.renderNetworkStatisticByFile(mouseEvent.point.itemId, activities);
					}
				};
				graphicHelper.generateGraphic("network-visualization", this.chartOption);
			});
		},
		renderNetworkStatisticByFile: function(fileUrl, activities) {
			var scope = this;
			selectArchive.select(activities, "default", {
				type: "file-method-request-count",
				fileUrl: fileUrl
			}).then(result => {
				var categoryAndSeries = this.getCategoriesAndSeriesForBar(result);
				this.chartOption = {
					type: "horizontal-bar",
					caption: "Method Statistic",
					subtitle: "script: " + selectArchive.parseJsFileName(fileUrl),
					categories: categoryAndSeries.categories,
					xAxis: {
						text: "Method Name"
					},
					yAxis: {
						text: "Request Count"
					},
					series: categoryAndSeries.series,
					onClick: function(mouseEvent) {
						scope.renderNetworkStatisticByRequest(mouseEvent.point.itemId, activities);
					}
				};
				graphicHelper.generateGraphic("network-method-visualization", this.chartOption);
			});
		},
		renderNetworkStatisticByRequest: function(fileUrl, methodId, activities) {
			var scope = this;
			selectArchive.select(activities, "default", {
				type: "file-request-request-count",
				fileUrl: fileUrl,
				methodId: methodId
			}).then(result => {
				var categoryAndSeries = this.getCategoriesAndSeriesForBar(result);
				this.chartOption = {
					type: "horizontal-bar",
					caption: "Request Statistic",
					subtitle: "script: " + selectArchive.parseJsFileName(fileUrl),
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
				graphicHelper.generateGraphic("network-method-visualization", this.chartOption);
			});
		},
		getCategoriesAndSeriesForBar: function(data) {
			return {
				categories: _.map(data, item => item.name),
				series: [{
					name: "script",
					data: _.map(data, item => {
						return {
							y: item.count,
							itemId: item.id
						};
					})
				}]
			};
		},
		onAddActivity: function(requestId) {
			var networkActivity = this.model.get("networkActivity");
			if(networkActivity && networkActivity[requestId]) {
				var request = networkActivity[requestId];
			}
		},
		networkSelectorChanges: function(item) {
			var view = new viewCntr({
				model: item,
				paramSelector: "#network-params",
				graphSelector: "#network-visualization"
			});
			$("#selectors").append(view.render().el);
			this.selectorsViews.push(view);
		},
		onSelectorResultDataChange: function() {
			$("#network-params").empty();
			$("#network-visualization").empty();
			for(var i in this.selectorsViews) {
				var view = this.selectorsViews[i];
				view.renderData();
			}
		}
	});
	return networkView;
});