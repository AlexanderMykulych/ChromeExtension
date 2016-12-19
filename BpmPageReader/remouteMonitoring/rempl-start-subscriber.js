function OnMessageRecived(message) {
	var id = message.id;
}
if(!subscriber) {
	var subscriber = CreateSubscriber("Test", null, null, OnMessageRecived);
}
if(!viewHelper) {
	var viewHelper = new ViewHelper();
}
RegisterAction(subscriber);
