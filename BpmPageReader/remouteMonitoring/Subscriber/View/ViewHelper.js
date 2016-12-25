define("ViewHelper", ["ViewTemplate", "ViewNetworkHelper"], function(ViewTemplate, networkHelper) {
	return {
		generatePageInfoTable: function(data, captionsMap) {
			var dataDiv = $("div#info .main #info");
			dataDiv.empty();
			var domStr = "";
			if(captionsMap) {
				captionsMap.forEach(function(item, index) {
					if(data[item.name]) {
						domStr += scope.generateRowWithTwoColumns(item.caption, data[item.name]);
					}
				}, scope);
			}
			dataDiv.append(domStr);
		},
		generateRowWithTwoColumns: function(value1, value2) {
			return String.format('\
				<div class="section card-panel teal lighten-2">\
					<h5 class="header">{0}</h5>\
					<p>{1}</p>\
				</div>', value1, value2);
		},
		generateStructureView: function(structure) {
			var dataDiv = $("div#info .main #moduleInfo");
			dataDiv.empty();
			dataDiv.append(ViewTemplate.DivColumns({
				id: "moduleStructure",
				col: 6
			}, {
				id: "entityStructure",
				col: 6
			}));
			var moduleStructureDiv = dataDiv.children("#moduleStructure");
			var entityStructureDiv = dataDiv.children("#entityStructure");

			var moduleLiStr = "";
			for(var structName in structure.moduleStructure) {
				var struct = structure.moduleStructure[structName];
				var tableStr = ViewTemplate.TableWithTwoColumn({
					data: struct
				});
				moduleLiStr += ViewTemplate.LiCollaps({
					value: structName,
					innerText: tableStr
				});
			}
			moduleStructureDiv.append(ViewTemplate.UlCollaps({
				innerText: moduleLiStr
			}));
			$(document).ready(function(){
				$('.collapsible').collapsible();
			});
		},
		generateNetworkView: function(data) {
			var dataSet = this.prepareNetworkData(data, "request-count", "file");
			var scope = this;
			var fileContainerSelector = "#network-visualization";
			$(fileContainerSelector).empty();
			networkHelper.draw(fileContainerSelector, dataSet, function(fileInfo, navigation) {
				var fileNav = navigation.slice();
				fileNav.push(fileInfo.name);
				scope.generateNetworkFileView(data, fileInfo.id, fileNav);
				var requestNav = navigation.slice();
				requestNav.push(fileInfo.name);
				scope.generateNetworkRequestView(data, {
					type: "file",
					id: fileInfo.id
				}, requestNav);
			}, {
				caption: "Files"
			});
		},
		generateNetworkFileView: function(data, id, navigation) {
			var methodsDataSet = this.prepareNetworkData(data, "request-count", "methods", {
				id: id
			});
			var scope = this;
			var methodContainerSelector = "#network-method-visualization";
			$(methodContainerSelector).empty();
			networkHelper.draw(methodContainerSelector, methodsDataSet, function(method) {
				var requestNav = navigation.slice();
				requestNav.push(method.name);
				scope.generateNetworkRequestView(data, {
					type: "methods",
					id: id,
					methodName: method.name
				}, requestNav);
			}, {
				caption: "Methods",
				navigation: navigation
			});
		},
		generateNetworkRequestView: function(data, info, navigation) {
			var methodsDataSet = this.prepareNetworkData(data, "request-count", "request", info);
			var scope = this;
			var methodContainerSelector = "#network-request-visualization";
			$(methodContainerSelector).empty();
			networkHelper.draw(methodContainerSelector, methodsDataSet, null, {
				caption: "Requests",
				navigation: navigation
			});
		},
		prepareNetworkData: function(data, type, detalization, info) {
			var scope = this;
			switch(type) {
				case "request-count":
					if(detalization === "file") {
						return $linq(data)
							.select((x, index) => {
								return {
									name: scope.parseJsFileName(x.fileUrl),
									count: x.count,
									id: x.fileIndex
								};
							})
							.orderByDescending(x => x.count)
							.toArray();
					} else if(detalization === "methods") {
						return $linq($linq(data)
							.firstOrDefault(x => x.fileIndex == info.id)
							.methods)
							.select(x => {
								return {
									name: x.name,
									count: x.count,
									id: x.name
								};
							})
							.orderByDescending(x => x.count)
							.toArray();
					} else if(detalization === "request") {
						if(info.type === "file") {
							return $linq($linq(data)
								.firstOrDefault(x => x.fileIndex === info.id)
								.methods)
								.selectMany(x => x.requestedUrl)
								.groupBy(x => x, x => x)
								.select(x => {
									return {
										name: x.key,
										count: x.values.length
									};
								})
								.orderByDescending(x => x.count)
								.toArray();
						} else if(info.type === "methods") {
							return $linq($linq(data)
								.firstOrDefault(x => x.fileIndex === info.id)
								.methods)
								.where(x => x.name === info.methodName)
								.selectMany(x => x.requestedUrl)
								.groupBy(x => x, x => x)
								.select(x => {
									return {
										name: x.key,
										count: x.values.length
									};
								})
								.orderByDescending(x => x.count)
								.toArray();
						}
					}
					return [];
				case "request-time":
					return [];
				break;
			}
		},
		parseJsFileName: function(fileName) {
			var reg = /([^\/]+)(?=.\w+$)\js/;
			var jss = fileName.match(reg);
			if(jss != null && jss.length > 0) {
				return jss[0];
			} else {
				return fileName;
			}
		}
	};
});