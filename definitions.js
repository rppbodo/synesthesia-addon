var ELEMENT_NODE = 1;
var ATTRIBUTE_NODE = 2;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;

var tagHistogram = {};
var tags = {};
var tagStyle = {};

var init = function() {
	tagHistogram = {};
	tags = {};
	tagStyle = {};
};

var insertElementWithStyle = function(element) {
	tags[element.tagName].push(element);

	tagStyle[element.tagName][0].push(element.offsetWidth);
	tagStyle[element.tagName][1].push(element.offsetHeight);
	tagStyle[element.tagName][2].push(element.offsetTop);
	tagStyle[element.tagName][3].push(element.offsetLeft);

	var style = getComputedStyle(element, null);
	tagStyle[element.tagName][4].push(getPadding(style));
	tagStyle[element.tagName][5].push(getBorderWidth(style));
	tagStyle[element.tagName][6].push(getMargin(style));
};

var loadHtml = function(element) {
	if (element.tagName in tagHistogram) {
		tagHistogram[element.tagName] += 1;
	} else {
		tagHistogram[element.tagName] = 1;

		tags[element.tagName] = [];

		tagStyle[element.tagName] = [];
		for (var i = 0; i < 7; i++) {
			tagStyle[element.tagName][i] = [];
		}
	}
	insertElementWithStyle(element);

	var children = element.childNodes;
	if (children.length != 0) {
		var i;
		for (var i = 0; i < children.length; i++) {
			var item = children[i];
			if (item.nodeType == ELEMENT_NODE) {
				loadHtml(item);
			}
		}
	}
};

var interpret = function(data, onsetAutoMap) {
	var config = {};
	// HTML tag
	config["tag"] = data[0];

	// Instrument
	config["instrument"] = data[1];

	// Note: a * x + b
	config["note"] = {};
	config["note"]["a"] = parseFloat(data[2]);
	config["note"]["x"] = data[3];
	config["note"]["b"] = parseFloat(data[4]);

	// Duration: a * x + b
	config["duration"] = {};
	config["duration"]["a"] = parseFloat(data[5]);
	config["duration"]["x"] = data[6];
	config["duration"]["b"] = parseFloat(data[7]);

	// Dynamics: a * x + b
	config["dynamics"] = {};
	config["dynamics"]["a"] = parseFloat(data[8]);
	config["dynamics"]["x"] = data[9];
	config["dynamics"]["b"] = parseFloat(data[10]);

	if (!onsetAutoMap) {
		// Onset: a * x + b
		config["onset"] = {};
		config["onset"]["a"] = parseFloat(data[11]);
		config["onset"]["x"] = data[12];
		config["onset"]["b"] = parseFloat(data[13]);
	}

	return config;
};

var generateNote = function(config, i, onsetAutoMap, onset) {
	var note = {};
	note.synth = config.instrument;
	note.element = tags[config.tag][i];
	note.note = parseInt(config.note.a * tagStyle[config.tag][config.note.x][i] + config.note.b);
	note.duration = config.duration.a * tagStyle[config.tag][config.duration.x][i] + config.duration.b;
	note.dynamics = config.dynamics.a * tagStyle[config.tag][config.dynamics.x][i] + config.dynamics.b;
	if (!onsetAutoMap) {
		note.onset = config.onset.a * tagStyle[config.tag][config.onset.x][i] + config.onset.b;
	} else {
		note.onset = onset;
	}
	return note;
};

var getMax = function(array, key) {
	var maxValue = -Infinity;
	for (var i = 0; i < array.length; i++) {
		if (key === undefined) {
			if (array[i] > maxValue) {
				maxValue = array[i];
			}
		} else {
			if (array[i][key] > maxValue) {
				maxValue = array[i][key];
			}
		}
	}
	return maxValue;
};

var getMin = function(array, key) {
	var minValue = Infinity;
	for (var i = 0; i < array.length; i++) {
		if (key === undefined) {
			if (array[i] < minValue) {
				minValue = array[i];
			}
		} else {
			if (array[i][key] < minValue) {
				minValue = array[i][key];
			}
		}
	}
	return minValue;
};

var normalize = function(array) {
	var minValue = getMin(array);
	var maxValue = getMax(array);

	if (minValue == maxValue) {
		for (var i = 0; i < array.length; i++) {
			array[i] = 0.5;
		}
	} else {
		for (var i = 0; i < array.length; i++) {
			array[i] = (array[i] - minValue) / (maxValue - minValue);
		}
	}

	return array;
};

var normalizeAll = function(config) {
	for (var i = 0; i < 7; i++) {
		var array = normalize(tagStyle[config.tag][i]);
		tagStyle[config.tag][i] = array;

		var minValue = getMin(array);
		if (minValue == Infinity || minValue === Infinity) {
			console.log("something gone wrong with minValue!");
		}

		var maxValue = getMax(array);
		if (maxValue == -Infinity || maxValue === -Infinity) {
			console.log("something gone wrong with maxValue!");
		}
	}
};

var getNumber = function(measure) {
	return parseInt(measure.replace(/[^-\d\.]/g, '')) || 0;
};

var sumNumbers = function(measure) {
	var parts = measure.split(" ");
	var sum = 0;
	var i;
	for (i = 0; i < parts.length; i++) {
		sum += getNumber(parts[i]);
	}
	return sum;
};

var getPadding = function(style) {
	var p = sumNumbers(style.padding);
	var pt = getNumber(style.paddingTop);
	var pl = getNumber(style.paddingLeft);
	var pb = getNumber(style.paddingBottom);
	var pr = getNumber(style.paddingRight);
	return p + pt + pl + pb + pr;
};

var getBorderWidth = function(style) {
	var bw = sumNumbers(style.borderWidth);
	var btw = getNumber(style.borderTopWidth);
	var blw = getNumber(style.borderLeftWidth);
	var bbw = getNumber(style.borderBottomWidth);
	var brw = getNumber(style.borderRightWidth);
	return bw + btw + blw + bbw + brw;
};

var getMargin = function(style) {
	var m = sumNumbers(style.margin);
	var mt = getNumber(style.marginTop);
	var ml = getNumber(style.marginLeft);
	var mb = getNumber(style.marginBottom);
	var mr = getNumber(style.marginRight);
	return m + mt + ml + mb + mr;
};

var dataURItoBlob = function(dataURI, type) {
	var byteString = atob(dataURI.split(',')[1]);
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
	var ab = new ArrayBuffer(byteString.length);
	var ia = new Uint8Array(ab);
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
	var bb = new Blob([ab], { type: type });
	return bb;
};
