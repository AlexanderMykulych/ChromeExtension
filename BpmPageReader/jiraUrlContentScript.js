var url = getUrlFromRightPanel();
copyToClipboard(url);

function getUrlFromRightPanel() {
	var aItem = $(".ghx-detail-description.ghx-fieldtype-undefined.ghx-fieldname-issuekey>a");
	return window.location.origin + aItem.attr("href")
}