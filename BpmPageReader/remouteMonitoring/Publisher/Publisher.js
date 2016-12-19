function CreatePublisher(key, host, port, onMessageRecived) {
	return new Connector("publisher", key, host, port, onMessageRecived);
}