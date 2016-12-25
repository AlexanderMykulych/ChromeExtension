define("StructureInfo", [], function() {
	return {
		getInfo: function(connector, callback) {
			connector.sendObj({
				subject: "StructureInfo"
			}, callback);
		}
	};
});