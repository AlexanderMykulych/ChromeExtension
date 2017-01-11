define("ViewNetworkHelper", [], function() {
	return {
		draw: function(selector, data, onClick, labelInfo) {
			var margin = {top: 40, right: 20, bottom: 30, left: 40},
				width = 1400 - margin.left - margin.right,
				height = 500 - margin.top - margin.bottom;
			d3.select(selector).append("div")
				.attr("class", "mydiv");
			if(labelInfo) {
				if(labelInfo.caption) {
					d3.select(selector + " div.mydiv")
						.append("h2")
						.attr("class", "header")
						.html(function() { return labelInfo.caption; });
				}
				if(labelInfo.navigation && labelInfo.navigation.length) {
					var navDiv = d3.select(selector + " div.mydiv")
						.append("nav")
						.append("div")
							.attr("class", "nav-wrapper")
						.append("div")
							.attr("class", "col s12");
					for(var index in labelInfo.navigation) {
						var nav = labelInfo.navigation[index];
						navDiv.append("a")
							.attr("class", "breadcrumb")
							.attr("href", "#!")
							.html(function() { return nav; });
					}
				}
			}
			var formatPercent = d3.format(".0");

			var x = d3.scaleOrdinal()
				.range([0, width], .1);

			var y = d3.scaleLinear()
				.range([0, height]);

			var xAxis = d3.axisBottom(x)
				.ticks(10);

			var yAxis = d3.axisLeft(y)
				.ticks(20)
				.tickFormat(d3.format(".0s"));

			var tip = d3.tip()
				.attr('class', 'd3-tip')
				.offset([-10, 0])
				.html(function(d) {
					return "<strong>Количество:</strong> <span style='color:red'>" + d.name + ", " + d.count + "</span>";
				});
			var svg = d3.select(selector + " div.mydiv")
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom + 150)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			svg.call(tip);
			x.domain(data.map(function(d) { return d.name; }));
			y.domain([0, d3.max(data, function(d) { return d.count; })]);

			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0." + height + ")")
				.call(xAxis)
					.selectAll("text")
					.style("text-anchor", "end")
					.attr("dx", "-.8em")
					.attr("dy", ".15em")
					.attr("transform", function(d) {
						return "rotate(-45)";
					});

			svg.append("g")
				.attr("class", "y axis")
				.call(yAxis)
			.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.style("glyph-orientation-vertical", "auto")
				.text("Количество запросов");

			svg.selectAll(".bar")
				.data(data)
			.enter().append("rect")
				.attr("class", "bar")
				.attr("x", function(d) { return x(d.name); })
				.attr("width", x.range())
				.attr("y", function(d) { return y(d.count); })
				.attr("height", function(d) { return height - y(d.count); })
				.on('mouseover', tip.show)
				.on('mouseout', tip.hide)
				.on('click', function(d) {
					if(onClick) {
						onClick(d, labelInfo.navigation ? labelInfo.navigation : []);
					}
				});
			function type(d) {
				d.count = +d.count;
				return d;
			}
		}
	};
});