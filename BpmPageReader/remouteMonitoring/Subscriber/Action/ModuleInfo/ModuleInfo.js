define("ModuleInfo", ["StructureInfo", "ViewHelper"], function(structureInfo, viewHelper) {
	return {
		action: function(connector) {
			structureInfo.getInfo(connector, function(data) {
				viewHelper.generateStructureView(data.result);
			});
		}
	};
})