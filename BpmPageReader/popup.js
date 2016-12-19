console.log(new Date());
console.log(chrome.debugger);
chrome.tabs.executeScript(null, {file: "jquery-3.1.0.min.js"}, function() {
	chrome.tabs.executeScript(null, {file: "ClipboardCopyText.js"}, function() {
		chrome.tabs.executeScript(null, { file: "ActivitytableExtension.js" });
	});
});

document.addEventListener('DOMContentLoaded', function() {
	var checkPageButton = document.getElementById('checkPage');
	var checkPageButtonControl = document.getElementById('checkPage2');
	var checkPageButton3 = document.getElementById('checkPage3');
	var jiraGetUrlButton = document.getElementById('jiraGetUrl');
	var jiraGetUrlActiveTaskButton = document.getElementById('jiraGetUrlActiveTask');
	var jiraGenerateTaskTitleButton = document.getElementById('jiraGenerateTaskTitle');
	checkPageButton.addEventListener('click', function() {
		chrome.tabs.executeScript(null, {file: "columnLoadingConfig.js"}, function() {
			chrome.tabs.executeScript(null, {file: "contentScript.js"});
		})
	}, false);
	checkPageButtonControl.addEventListener('click', function() {
		chrome.tabs.executeScript(null, {file: "controlLoadingConfig.js"}, function() {
			chrome.tabs.executeScript(null, {file: "contentScript.js"});
		});
	}, false);
	jiraGetUrlButton.addEventListener('click', function() {
		chrome.tabs.executeScript(null, {file: "jquery-3.1.0.min.js"}, function() {
			chrome.tabs.executeScript(null, {file: "ClipboardCopyText.js"}, function() {
				chrome.tabs.executeScript(null, {file: "jiraUrlContentScript.js"});
			});
		});
	}, false);
	jiraGetUrlActiveTaskButton.addEventListener('click', function() {
		chrome.tabs.executeScript(null, {file: "jquery-3.1.0.min.js"}, function() {
			chrome.tabs.executeScript(null, {file: "ClipboardCopyText.js"}, function() {
				chrome.tabs.executeScript(null, {file: "jiraUrlContentScript2.js"});
			});
		});
	}, false);
	jiraGenerateTaskTitleButton.addEventListener('click', function() {
		chrome.tabs.executeScript(null, {file: "jquery-3.1.0.min.js"}, function() {
			chrome.tabs.executeScript(null, {file: "ClipboardCopyText.js"}, function() {
				chrome.tabs.executeScript(null, {file: "jiraUrlContentScript3.js"});
			});
		});
	}, false);
	checkPageButton3.addEventListener('click', function() {
		chrome.tabs.executeScript(null, {file: "remouteMonitoring/Publisher/Injector.js"}, function() {
			window.open(chrome.extension.getURL('remouteMonitoring/Subscriber/index.html'), "_blank", 'height=XXX,width=*,toolbar=0,location=0,menubar=0,alwaysRaised=yes');
		});
	}, false);
}, false);

chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse) {
		if ( message.from == "content" && message.message == "getTabId")
		{
			var tabId = sender.tab.id;
			sendResponse({ from: 'event', message: '', tabId: tabId });
		}
	}
);