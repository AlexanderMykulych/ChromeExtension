function injectScript(file, node) {
	var th = document.getElementsByTagName(node)[0];
	var s = document.createElement('script');
	s.setAttribute('type', 'text/javascript');
	s.setAttribute('src', file);
	s.setAttribute('charset', 'utf-8');
	th.appendChild(s);
}
if(window.pageReaderType == 1) {
	injectScript(chrome.extension.getURL('columnLoadingConfig.js'), 'body');
} else {
	injectScript(chrome.extension.getURL('controlLoadingConfig.js'), 'body');
}
injectScript(chrome.extension.getURL('pageReader.js'), 'body');