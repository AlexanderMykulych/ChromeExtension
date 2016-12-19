$(".scheduleritem").off("click");
$(".myActivityButton").remove();
$(".scheduleritem").on("click", function(item) {
	$(".myActivityButton").remove();
	var el = $(this);
	var pos = el.offset();
	var width = el.width();
	var urlActive = chrome.extension.getURL("/copy.png");
	var urlDisable = chrome.extension.getURL("/copy_dis.png");
	var html = `
		  <div class = "myActivityButton" style="left: `+ Math.round(pos.left + width + 5) +`px; top:`+ pos.top +`px">
		    <img class="image_off" src="` + urlActive + `" />
		    <img class="image_on" src="` + urlDisable + `" />
		  </div>
		`;
	el.parent().append(html);
	$(".myActivityButton").on("click", function() {
		var txt = el.find(".scheduleritem-title").text();
		var sharpIndex = txt.search("#");
		if(sharpIndex > -1) {
			txt = txt.slice(sharpIndex);
		}
		$(".myActivityButton").remove();
		copyToClipboard(txt);
	});
});