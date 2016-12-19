function injectScript(file) {
	var th = document.getElementsByTagName("body")[0];
	var s = document.createElement('script');
	s.setAttribute('type', 'text/javascript');
	s.setAttribute('src', chrome.extension.getURL(file));
	s.setAttribute('charset', 'utf-8');
	th.appendChild(s);
}
function injectScriptText(text) {
	var th = document.getElementsByTagName("body")[0];
	var s = document.createElement('script');
	s.setAttribute('type', 'text/javascript');
	s.setAttribute('charset', 'utf-8');
	s.innerHTML = text;
	th.appendChild(s);
}
chrome.runtime.sendMessage({ from: 'content', message: 'getTabId' }, function(callbackResponse) {
	if (callbackResponse.from == 'event') {
		var text = 'window["ExtensionTabId"] = ' + callbackResponse.tabId;
		injectScriptText(text);
	}
});
injectScript("remouteMonitoring/Connector/Connector.js");
injectScript("remouteMonitoring/Publisher/Publisher.js");
injectScript("remouteMonitoring/MonitoringModule/PageInfoAction.js");
injectScript("remouteMonitoring/MonitoringModule/StructureInfo/StructureInfoAction.js");
injectScript("remouteMonitoring/MonitoringModule/Network/NetworkUtil.js");
injectScript("remouteMonitoring/rempl-start.js");