var synths = ["Block", "Drum", "Guitar", "Harpsichord", "Maraca", "Pong"];
var fields = ["width", "height", "top", "left", "padding", "borderWidth", "margin"];

var getRandom = function(min, max) {
	return Math.random() * (max - min) + min;
};

var getSynths = function(selected) {
	var html = "Instrument: <select>";
	for (var i = 0; i < 6; i++) {
  	html += "<option value=\"" + i + "\"" + (i ==  selected ? "selected" : "") + ">" + synths[i] + "</option>";
	}
  html += "</select><br />";
	return html;
};

var getFields = function(selected) {
	var html = "<select>";
	for (var i = 0; i < 7; i++) {
  	html += "<option value=\"" + i + "\"" + (i ==  selected ? "selected" : "") + ">" + fields[i] + "</option>";
	}
	html += "</select>";
	return html;
};

var getMappings = function() {
	var html = getSynths(Math.floor(getRandom(0, 6)));
	html += "Note: <input type=\"number\" value=\"" + getRandom(32, 64) + "\" /> * ";
	html += getFields(Math.floor(getRandom(0, 7))) + " + <input type=\"number\" value=\"" + getRandom(32, 64) + "\" /><br />";
	html += "Onset: <input type=\"number\" value=\"" + getRandom(0, 10000) + "\" /> * ";
	html += getFields(Math.floor(getRandom(0, 7))) + " + <input type=\"number\" value=\"" + getRandom(0, 10000) + "\" /><br />";
	html += "Duration: <input type=\"number\" value=\"" + getRandom(500, 2500) + "\" /> * ";
	html += getFields(Math.floor(getRandom(0, 7))) + " + <input type=\"number\" value=\"" + getRandom(500, 2500) + "\" /><br />";
	html += "Dynamics: <input type=\"number\" value=\"" + getRandom(0, 1) + "\" /> * ";
	html += getFields(Math.floor(getRandom(0, 7))) + " + <input type=\"number\" value=\"" + getRandom(0, 1) + "\" /><br />";
	return html;
};

var generateData = function() {
	var data = [];
	var element = document.getElementById("tag-list");
	var children = element.childNodes[0].childNodes;
	for (var i = 0; i < children.length; i++) {
		var e = children[i];
		if (e.tagName == "LI") {
			data.push(e.innerHTML);
		} else if (e.tagName == "INPUT") {
			data.push(e.value);
		} else if (e.tagName == "SELECT") {
			data.push(e.options[e.selectedIndex].value);
		}
	}
	return data;
};

document.addEventListener("click", (e) => {
	if (e.target.id == "tags") {
		browser.tabs.executeScript(null, {
			file: "/content_scripts/tags.js"
		});

		var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
		gettingActiveTab.then((tabs) => {
			browser.tabs.sendMessage(tabs[0].id, { nTags: document.getElementById("n-tags").value }).then(response => {
				var html = "<ol>";
				var tag;
				for (tag in response.response) {
					html += "<li>" + response.response[tag] + "</li>";
					html += getMappings();
				}
				html += "</ol>";
				html += "<button id=\"sonify\">sonify!</button>";
				html += "<button id=\"piano-roll\">piano roll</button>";
				document.getElementById("tag-list").innerHTML = html;
	    });
		});
	} else if (e.target.id == "sonify" || e.target.id == "piano-roll") {
		browser.tabs.executeScript(null, {
			file: "/content_scripts/" + e.target.id + ".js"
		});

		var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
		gettingActiveTab.then((tabs) => {
			browser.tabs.sendMessage(tabs[0].id, { data: generateData() });
		});
	}
});
