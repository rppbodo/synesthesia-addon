'use strict';

var getRandom = function(min, max) {
	return Math.random() * (max - min) + min;
};

var getSynths = function() {
	var html = "Instrument: <select>";
  html += "<option value=\"0\">Block</option>";
  html += "<option value=\"1\">Drum</option>";
  html += "<option value=\"2\">Guitar</option>";
  html += "<option value=\"3\">Harpsichord</option>";
	html += "<option value=\"4\">Maraca</option>";
	html += "<option value=\"5\">Pong</option>";
  html += "</select><br />";
	return html;
};

var getFields = function() {
	var html = "<select>";
  html += "<option value=\"0\">width</option>";
  html += "<option value=\"1\">height</option>";
  html += "<option value=\"2\">top</option>";
  html += "<option value=\"3\">left</option>";
	html += "<option value=\"4\">padding</option>";
	html += "<option value=\"5\">borderWidth</option>";
	html += "<option value=\"6\">margin</option>";
	html += "</select>";
	return html;
};

var getMappings = function() {
	var html = getSynths();
	html += "Note: <input type=\"number\" /> * ";
	html += getFields() + " + <input type=\"number\" /><br />";
	html += "Onset: <input type=\"number\" /> * ";
	html += getFields() + " + <input type=\"number\" /><br />";
	html += "Duration: <input type=\"number\" /> * ";
	html += getFields() + " + <input type=\"number\" /><br />";
	html += "Dynamics: <input type=\"number\" /> * ";
	html += getFields() + " + <input type=\"number\" /><br />";
	return html;
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
				document.getElementById("tag-list").innerHTML = html;
	    });
		});
	} else if (e.target.id == "sonify") {
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
		browser.tabs.executeScript(null, {
			file: "/content_scripts/sonify.js"
		});

		var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
		gettingActiveTab.then((tabs) => {
			browser.tabs.sendMessage(tabs[0].id, { data: data });
		});
	}
});
