;
function downloadLabelsInfo() {
	var moduleId = "CardContentContainer";
	var module = Ext.getCmp(moduleId);
	initModuleViewModule();
}
function getPageName() {
	var pageNames = /\w*(?:PageV2)/.exec(window.location.href);
	if(Ext.isEmpty(pageNames)) {
		pageNames = /\w*(?:Page)/.exec(window.location.href);
		if(Ext.isEmpty(pageNames)) {
			return "";
		}
	}
	return pageNames[0];
}
function CreateExcellHelper() {
	return {
		emitXmlHeader: function(columns) {
			var headerRow =  '<ss:Row>\n';
			for (var colName in columns) {
				headerRow += '  <ss:Cell>\n';
				headerRow += '    <ss:Data ss:Type="String">';
				headerRow += colName + '</ss:Data>\n';
				headerRow += '  </ss:Cell>\n';
			}
			headerRow += '</ss:Row>\n';
			return '<?xml version="1.0"?>\n' +
				   '<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n' +
				   '<ss:Worksheet ss:Name="Sheet1">\n' +
				   '<ss:Table>\n\n' + headerRow;
		},
		emitXmlFooter: function() {
			return '\n</ss:Table>\n' +
				   '</ss:Worksheet>\n' +
				   '</ss:Workbook>\n';
		},
		jsonToSsXml: function (jsonObject) {
			var row;
			var col;
			var xml;
			var data = typeof jsonObject != "object" 
					 ? JSON.parse(jsonObject) 
					 : jsonObject;
			var columns = [];
			data.map(function(item) {
				for(var i in item) {
					columns[i] = 1;
				}
			});
			xml = this.emitXmlHeader(columns);

			for (row = 0; row < data.length; row++) {
				xml += '<ss:Row>\n';

				for (col in data[row]) {
					xml += '  <ss:Cell>\n';
					xml += '    <ss:Data ss:Type="String">';
					xml += data[row][col] + '</ss:Data>\n';
					xml += '  </ss:Cell>\n';
				}

				xml += '</ss:Row>\n';
			}

			xml += this.emitXmlFooter();
			return xml;
		},
		downloadExcell: function(text) {
			var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(text);

			// Now the little tricky part.
			// you can use either>> window.open(uri);
			// but this will not work in some browsers
			// or you will not get the correct file extension

			//this trick will generate a temp <a /> tag
			var link = document.createElement("a");
			link.href = uri;

			//set the visibility hidden so it will not effect on your web-layout
			link.style = "visibility:hidden";
			link.download = "PageLabel" + ".xls";

			//this part will append the anchor tag and remove it after automatic click
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}
}
var Resources = {};
function getSchemaResources(schemaBuilder, schemaName, callback) {
	schemaBuilder.getSchemaResources(schemaName, function(resources) {
		Resources = Ext.merge({}, resources, Resources);
		schemaBuilder.getSchemaStructure(schemaName, function(structure) {
			var parentSchemaName = structure.parentSchemaName;
			if(!!parentSchemaName) {
				getSchemaResources(schemaBuilder, parentSchemaName, callback)
			} else {
				if(Ext.isFunction(callback)) {
					callback.call(this);
				}
			}
		}, this);
	}, this);
}
function initModuleViewModule() {
	Terrasoft.require(["SchemaBuilderV2"], function(schemaBuilder) {
		schemaBuilder.build({
			schemaName: getPageName(),
			useCache: true,
			profileKey: ""
		}, function(viewModelClass, schemaView, schema) {
			getSchemaResources(schemaBuilder, getPageName(), function() {
				debugger;
				var result = getInfo(schemaView[0]);
				var excelHelper = CreateExcellHelper();
				var xml = excelHelper.jsonToSsXml(result);
				excelHelper.downloadExcell(xml);
			});
		}, this);
	});
}

function getItemsInfo(module, infos) {
	var elementConfig = null;
	if(
		(window.pageReaderType == 1 && onlyColumnConfig.includes(module.className))
		||
		(window.pageReaderType == 2 && onlyControlConfig.includes(module.className))
	) {
		elementConfig = controlConfig[module.className];
	}
	if(elementConfig != null) {
		infos.push(elementConfig.getInfo(module));
	} else {
		console.log(module);
	}
	if(!Ext.isEmpty(module.items) && module.items.length > 0) {
		var items = module.items;
		for(var i = 0; i < items.length; i++) {
			var item = items[i];
			item["parentElement"] = module;
			getItemsInfo(item, infos);
			if(!Ext.isEmpty(item.item)) {
				getItemsInfo(item.item, infos);
			}
		}
	}
}
function getInfo(schemaView) {
	var result = [];
	getItemsInfo(schemaView, result);
	return result;
}


var defaultConntrolConfig = {
	getInfo: function(element) {
		return {
			name: this.getLabel(element),
			id: element.id,
			isRequired: !!element.isRequired,
			bindTo: deepGet(element, ["value", "bindTo"], ""),
			value: null
		}
	},
	getLabel: function(element) {
		var parent = element.parentElement;
		var label = getLabel(parent);
		if(!label) {
			label = getLabel(parent.parentElement);
			if(!label) {
				label = getLabel(parent.parentElement.parentElement);
			}
		}
		return label;
	}
};
var controlConfig = {
	"Terrasoft.TextEdit": Ext.merge({}, defaultConntrolConfig, {

	}),
	"Terrasoft.MemoEdit": Ext.merge({}, defaultConntrolConfig, {

	}),
	"Terrasoft.FloatEdit": Ext.merge({}, defaultConntrolConfig, {

	}),
	"Terrasoft.DateEdit": Ext.merge({}, defaultConntrolConfig, {

	}),
	"Terrasoft.LookupEdit": Ext.merge({}, defaultConntrolConfig, {

	}),
	"Terrasoft.ComboBoxEdit": Ext.merge({}, defaultConntrolConfig, {

	}),
	"Terrasoft.TabPanel": Ext.merge({}, defaultConntrolConfig, {

	}),
	"Terrasoft.Button": Ext.merge({}, defaultConntrolConfig, {
		getInfo: function(element) {
			console.log(element);
			return {
				name: deepGet(element, ["caption", "bindTo"], ""),
				id: element.id,
				isRequired: null,
				bindTo: null,
				value: "[Button]"
			}
		}
	}),
	"Terrasoft.ImageEdit": Ext.merge({}, defaultConntrolConfig, {
		getInfo: function(element) {
			return {
				//name: "ComboBoxEdit",
				name: "[Image]",
				id: element.id,
				isRequired: !!element.isRequired,
				bindTo: deepGet(element, ["imageSrc", "bindTo"], ""),
				value: "[Image]"
			}
		}
	}),
	"Terrasoft.RectProgressBar": Ext.merge(defaultConntrolConfig, {
		getInfo: function(element) {
			return {
				name: "[Progress Bar]",
				id: element.id,
				isRequired: !!element.isRequired,
				bindTo: deepGet(element, ["value", "bindTo"], ""),
				value: "[Progress Bar]"
			}
		}
	}),
	"Terrasoft.CheckBoxEdit": Ext.merge({}, defaultConntrolConfig, {
		getInfo: function(element) {
			return {
				name: this.getLabel(element),
				id: element.id,
				isRequired: "",
				bindTo: deepGet(element, ["checked", "bindTo"], ""),
				value: "[CheckBox Edit]",
				enabled: !!element.enabled
			}
		}
	}),
	"Terrasoft.HtmlEdit": Ext.merge({}, defaultConntrolConfig, {
		getInfo: function(element) {
			return {
				name: this.getLabel(element),
				id: element.id,
				isRequired: !!element.isRequired,
				bindTo: null,
				value: "[Html Edit]"
			}
		}
	})
};
var onlyColumnConfig = [
	"Terrasoft.TextEdit",
	"Terrasoft.MemoEdit",
	"Terrasoft.FloatEdit",
	"Terrasoft.DateEdit",
	"Terrasoft.LookupEdit",
	"Terrasoft.ComboBoxEdit",
	"Terrasoft.RectProgressBar",
	"Terrasoft.CheckBoxEdit",
	"Terrasoft.HtmlEdit"
];
var onlyControlConfig = [
	"Terrasoft.ImageEdit",
	"Terrasoft.Button"
];

function getLabel(element, level) {
	if(Ext.isEmpty(element)) {
		return;
	}
	if(Ext.isEmpty(level)) {
		level = 0;
	}
	if(level == 3) {
		return "";
	}
	var items = element.items;
	if(!Ext.isEmpty(items)) {
		for(var i = 0; i < items.length; i++) {
			var item = items[i];
			if(item.className === "Terrasoft.Label" || item.className === "Terrasoft.TipLabel") {
				if(item && item.caption) {
					debugger;
					if(item.caption.bindTo) {
						var captionName = item.caption.bindTo.substr(18, item.caption.bindTo.length);
						return Resources.localizableStrings[captionName];
					} else if(typeof item.caption === "string"){
						return item.caption;
					}
				}
			}
			var label = getLabel(item, level++);
			if(!Ext.isEmpty(label)) {
				return label;
			}
		}
	}
	return "";
}
function deepGet (obj, props, defaultValue) {
	if (obj === undefined || obj === null) {
		return defaultValue;
	}

	if (props.length === 0) {
		debugger;
		var captionName = obj.substr(18, obj.length);
		if(Resources.localizableStrings[captionName]) {
			return Resources.localizableStrings[captionName];
		}
		return obj;
	}
	var foundSoFar = obj[props[0]];
	var remainingProps = props.slice(1);

	return deepGet(foundSoFar, remainingProps, defaultValue);
}
downloadLabelsInfo();
;