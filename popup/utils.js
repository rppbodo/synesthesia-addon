var synths = ["Block", "Drum", "Guitar", "Harpsichord", "Maraca", "Pong"];
var fields = ["width", "height", "top", "left", "padding", "borderWidth", "margin"];

var getRandom = function(min, max) {
	return Math.random() * (max - min) + min;
};

var getCheckedRadio = function(name) {
	var radios = document.getElementsByName(name);
	for (var i = 0, length = radios.length; i < length; i++) {
		if (radios[i].checked) {
			return radios[i].value;
		}
	}
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

var getMappings = function(onsetAutoMap) {
	var html = getSynths(Math.floor(getRandom(0, 6)));
	html += "Note: <input type=\"number\" value=\"" + getRandom(32, 64) + "\" /> * ";
	html += getFields(0) + " + <input type=\"number\" value=\"" + getRandom(0, 32) + "\" /><br />";
	html += "Duration: <input type=\"number\" value=\"" + getRandom(500, 2500) + "\" /> * ";
	html += getFields(2) + " + <input type=\"number\" value=\"" + getRandom(500, 2500) + "\" /><br />";
	html += "Dynamics: <input type=\"number\" value=\"" + getRandom(0, 1) + "\" /> * ";
	html += getFields(3) + " + <input type=\"number\" value=\"" + getRandom(0, 1) + "\" /><br />";
	if (!onsetAutoMap) {
		html += "Onset: <input type=\"number\" value=\"" + getRandom(0, 10000) + "\" /> * ";
		html += getFields(1) + " + <input type=\"number\" value=\"" + getRandom(0, 5000) + "\" /><br />";
	}
	return html;
};

var generateData = function() {
	var data = [];
	var element = document.getElementById("tag-list");
	var children = element.childNodes[1].childNodes;
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

