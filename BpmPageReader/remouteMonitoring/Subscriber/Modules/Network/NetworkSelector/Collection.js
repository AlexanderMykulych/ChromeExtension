define(["backbone", "NetworkSelectorModel"], function(Backbone, model) {
	var collection = Backbone.Collection.extend({
		model: model
	});
	return collection;
});