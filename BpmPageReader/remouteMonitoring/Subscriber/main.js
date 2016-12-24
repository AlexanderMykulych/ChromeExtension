requirejs.config({
	paths: {
	}
});
require(["RegisterAction"], function(registrator) {
	registrator.init();
});