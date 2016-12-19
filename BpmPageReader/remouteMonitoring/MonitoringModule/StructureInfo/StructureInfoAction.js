function StructureInfoAction() {
	this.getInfo = function() {
		return {
			entityStructure: Terrasoft.configuration.EntityStructure,
			moduleStructure: Terrasoft.configuration.ModuleStructure
		}
	}
}