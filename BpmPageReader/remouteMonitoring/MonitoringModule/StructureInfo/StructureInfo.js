function StructureInfo(connector) {
	this.connector = connector;
	this.getInfo = function(callback) {
		connector.sendObj({
			subject: "StructureInfo"
		}, callback);
	}
}