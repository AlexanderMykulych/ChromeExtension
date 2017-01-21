define(["backbone", "underscore"], function(Backbone, _) {
	return Backbone.Model.extend({
		defaults: {
			name: "",
			id: null,
			getNetworkActivities: null,
			SelectorResultData: null
		},
		initialize: function() {
			this.id = _.uniqueId("SelectorModel_");
			this.set("id", this.id);
		},
		executeQuery: function() {
			var getActivities = this.get("getNetworkActivities");
			if(_.isFunction(getActivities)) {
				var array = getActivities();
				var query = this.get("query");
				var result = eval(query);
				this.set("SelectorResultData", null);
				this.set("SelectorResultData", result);
			}
		}
	});
});