requirejs.config({
	paths: {
	}
});
require(["Subscriber", "RegisterAction"], function(registrator) {

	registrator.init();
});