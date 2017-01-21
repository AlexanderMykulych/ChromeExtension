define("Subscriber", [], function() {
	return {
		createSubscriber: function(key, host, port, onMessageRecived, onConnect) {
			return new Connector("subscriber", key, host, port, onMessageRecived, function() {
				Materialize.toast('Connected!', 4000);
				if(onConnect) {
					onConnect();
				}
			}, function() {
				Materialize.toast('Disconnected!', 4000);
			});
		}
	};
});
