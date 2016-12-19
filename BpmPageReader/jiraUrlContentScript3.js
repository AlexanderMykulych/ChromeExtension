var text = generateActivityTitle();
copyToClipboard(text);

function generateActivityTitle() {
	if(window.location.pathname.startsWith("/secure")) {
		return generateTitleFromActivityTask();
	} else {
		return generateTitleFromPage();
	}
}

function generateTitleFromPage() {
	var aText = "#" + $(".aui-page-header-main a.issue-link").text();
	var link = window.location.href;
	var text = $("#summary-val").text();
	return aText + "\n" + link + "\n" + text;
}

function generateTitleFromActivityTask() {
	var aItem = $(".js-issue.js-sortable.js-parent-drag.ghx-issue-compact.ghx-type-3.ghx-selected.ghx-selected-primary");
	if(aItem.length <= 0) {
		aItem = $(".js-detailview.ghx-issue.js-issue.ghx-has-avatar.js-parent-drag.ghx-type-3.ghx-selected");
		return generateFromWorkBoard(aItem);
	} else {
		return generateInPlanBoard(aItem);
	}
}
function generateInPlanBoard(item) {
	var aText = "#" + item.find("a").text();
	var link = window.location.origin + item.find("a").attr("href");
	var text = item.find(".ghx-summary .ghx-inner").text();
	return aText + "\n" + link + "\n" + text;
}

function generateFromWorkBoard(item) {
	var aText = "#" + item.find(".ghx-key a").text();
	var link = window.location.origin + item.find(".ghx-key a").attr("href");
	var text = item.find(".ghx-summary .ghx-inner").text();
	return aText + "\n" + link + "\n" + text;
}
