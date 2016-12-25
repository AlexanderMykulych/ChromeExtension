define("ViewTemplate", [], function() {
	return {
		DivColumns: function() {
			var columns = "";
			for(var i in arguments) {
				var arg = arguments[i];
				columns += "\n" + this.DivColumn(arg);
			}
			return columns;
		},
		DivColumn: function(conf) {
			return String.format('<div id="{0}" class="col s{1}"></div>', conf.id, conf.col);
		},
		TableWithTwoColumn: function(conf) {
			var data = conf.data;
			var tableStr = '<table class="bordered"><tbody>';
			for(var name in data) {
				var value = data[name];
				tableStr += "\n" + this.TrWithTwoTd(name, value);
			}
			tableStr += "\n" + "</tbody></table>"
			return tableStr;
		},
		TrWithTwoTd: function(value1, value2) {
			return String.format('<tr><td>{0}</td><td>{1}</td></tr>', value1, value2);
		},
		LiCollaps: function(conf) {
			return String.format('<li><div class="collapsible-header">{0}</div><div class="collapsible-body">{1}</div></li>', conf.value, conf.innerText);
		},
		UlCollaps: function(conf) {
			return String.format('<ul class="collapsible" data-collapsible="accordion">{0}</ul>', conf.innerText);
		}
	};
});