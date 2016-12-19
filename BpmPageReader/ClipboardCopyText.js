;
function copyToClipboard(text) {
	var success   = true,
	range = document.createRange(),
	selection;
	if (window.clipboardData) {
		window.clipboardData.setData("Text", text);
	} else {
		// Create a temporary element off screen.
		var tmpElem = $('<div style="white-space: pre;">');
		tmpElem.css({
			position: "absolute",
			left:     "-1000px",
			top:      "-1000px",
		});
		tmpElem.text(text);
		$("body").append(tmpElem);
		range.selectNodeContents(tmpElem.get(0));
		selection = window.getSelection ();
		selection.removeAllRanges ();
		selection.addRange (range);
		success = document.execCommand ("copy", false, null);
		if (success) {
			alert (text + " is copy to clipboard!");
			tmpElem.remove();
		}
  }
}
;