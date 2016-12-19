function PageInfoAction() {
	this.getInfo = function() {
		return {
			href: window.location.href,
			pageName: getPageName(),
			webSocketUrl: Terrasoft.serviceUrl
		}
	}
}

function getPageName() {
	var pageNames = /\w*(?:PageV2)/.exec(window.location.href);
	if(!pageNames) {
		pageNames = /\w*(?:Page)/.exec(window.location.href);
		if(!pageNames) {
			return "";
		}
	}
	return pageNames[0];
}

