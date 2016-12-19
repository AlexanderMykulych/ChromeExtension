function CreateSubscriber(key, host, port, onMessageRecived) {
	return new Connector("subscriber", key, host, port, onMessageRecived, function() {
		Materialize.toast('Connected!', 4000);
	}, function() {
		Materialize.toast('Disconnected!', 4000);
	});
}