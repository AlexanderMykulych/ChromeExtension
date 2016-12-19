function PageInfo(connector) {
	this.connector = connector;
	this.getInfo = function(callback) {
		connector.sendObj({
			subject: "CardInfo"
		}, callback);
	}
}