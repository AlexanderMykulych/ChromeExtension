var url = getUrlFromRightPanel();
copyToClipboard(url);

function getUrlFromRightPanel() {
	var aItem = $(".js-issue.js-sortable.js-parent-drag.ghx-issue-compact.ghx-type-3.ghx-selected.ghx-selected-primary a");
	if(aItem.length <= 0) {
		aItem = $(".js-detailview.ghx-issue.js-issue.ghx-has-avatar.js-parent-drag.ghx-type-3.ghx-selected a");
	}
	return window.location.origin + aItem.attr("href")
}


