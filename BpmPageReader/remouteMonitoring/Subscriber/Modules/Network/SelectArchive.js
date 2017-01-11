define("SelectArchive", ["linq"], function($linq) {
	return {
		select: function(data, selectorId, selectorArgs) {
			switch(selectorId) {
				case "default":
					return this.getDefaultSelect(data, selectorArgs);
				break;
			}
		},
		getDefaultSelect: function(data, args) {
			var type = args.type;
			switch(type) {
				case "script-request-count":
					return this.getScriptRequestCount(data, args);
				break;
				case "file-method-request-count":
					return this.getScriptMethodRequestCount(data, args);
				break;
				case "file-request-request-count":
					return this.getRequestCount(data, args);
				break;
			}
		},
		getScriptRequestCount: function(data, args) {
			var scope = this;
			var result = $linq(_.map(data, function(item, key) { return item; }))
				.where(x => !!x["requestWillBeSent"] && x["requestWillBeSent"].initiator.type == "script")
				.selectMany(x => {
					return $linq(x["requestWillBeSent"].initiator.stack.callFrames)
							.select(y => {
								return {
									fileUrl: y.url
								};
							})
				})
				.groupBy(x => x.fileUrl, x => x)
				.distinct()
				.select(x => {
					return {
						id: x.key,
						name: scope.parseJsFileName(x.key),
						count: x.values.length
					};
				})
				.orderByDescending(x => x.count)
				.toArray();
			return new Promise(resolve => resolve(result));
		},
		getScriptMethodRequestCount: function(data, args) {
			var scope = this;
			var result = $linq(_.map(data, item => item))
				.where(x => !!x["requestWillBeSent"] && x["requestWillBeSent"].initiator.type == "script")
				.selectMany(x => {
					return $linq(x["requestWillBeSent"].initiator.stack.callFrames)
						.where(y => y.url === args.fileUrl)
						.select(y => {
							return {
								functionName: y.functionName == "" ? "anonymus" : y.functionName,
								lineNumber: y.lineNumber,
								columnNumber: y.columnNumber
							};
						});
				})
				.groupBy(x => x.functionName + x.lineNumber + x.columnNumber, x => x)
				.select(x => {
					var item = x.values[0];
					var id = this.getFunctionId(item);
					return {
						name : id,
						id: id,
						count: x.values.length
					};
				})
				.orderByDescending(x => x.count)
				.toArray();
			return new Promise(resolve => resolve(result));
		},
		getRequestCount: function(data, args) {
			var scope = this;
			var result = $linq(_.map(data, item => item))
				.where(x => !!x["requestWillBeSent"] && x["requestWillBeSent"].initiator.type == "script" &&
					$linq(x["requestWillBeSent"].initiator.stack.callFrames)
						.any(y => y.url === args.fileUrl && (!args.methodId || args.methodId === this.getFunctionId(y))))
				.select(x => x.request.url)
				.groupBy(x => x.request, x => x.request)
				.select(x => {
					return {
						name : x.key,
						id: x.key,
						count: x.values.length
					};
				})
				.orderByDescending(x => x.count)
				.toArray();
			return new Promise(resolve => resolve(result));
		},
		parseJsFileName: function(fileName) {
			var reg = /[^\/]+\.\js/;
			var jss = fileName.match(reg);
			if(jss != null && jss.length > 0) {
				return jss[0];
			} else {
				return fileName;
			}
		},
		getFunctionId: function(info) {
			var functionName = info.functionName == "" ? "anonymus" : info.functionName;
			return functionName + ":" + info.lineNumber + "," + info.columnNumber;
		}
	};
});