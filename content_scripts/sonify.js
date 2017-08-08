'use strict';

/* GLOBALS ********************************************************************/
var tagHistogram = {};
var tags = {};
var tagStyle = {};

/* LOAD SECTION ***************************************************************/
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

var load = function(element) {
	// if (isVisible(element)) {
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
	// }

	var children = element.childNodes;
	if (children.length != 0) {
		var i;
		for (var i = 0; i < children.length; i++) {
			var item = children[i];
			if (item.nodeType == ELEMENT_NODE) {
				load(item);
			}
		}
	}
};

/* PLAY SECTION ***************************************************************/
var interpret = function(data) {
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

  // Onset: a * x + b
  config["onset"] = {};
  config["onset"]["a"] = parseFloat(data[5]);
  config["onset"]["x"] = data[6];
  config["onset"]["b"] = parseFloat(data[7]);

  // Duration: a * x + b
  config["duration"] = {};
  config["duration"]["a"] = parseFloat(data[8]);
  config["duration"]["x"] = data[9];
  config["duration"]["b"] = parseFloat(data[10]);

  // Dynamics: a * x + b
  config["dynamics"] = {};
  config["dynamics"]["a"] = parseFloat(data[11]);
  config["dynamics"]["x"] = data[12];
  config["dynamics"]["b"] = parseFloat(data[13]);

  return config;
};

// http://youmightnotneedjquery.com/
var addClass = function(el, className) {
	if (el.classList) {
		el.classList.add(className);
	} else {
		el.className += ' ' + className;
	}
};

// http://youmightnotneedjquery.com/
var removeClass = function(el, className) {
	if (el.classList) {
	 el.classList.remove(className);
	} else {
	 el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	}
};

var playNote = function(note) {
	setTimeout(function() {
		var synth = synthFactory(note.synth);
		synth.play(parseInt(note.note), note.dynamics);

		note.element.scrollIntoView(true);
		addClass(note.element, "sonification-addon-highlight");

	  setTimeout(function () {
	    synth.stop();
	    synth = undefined;
	    // removeClass(note.element, "sonification-addon-highlight");
	  }, note.duration);
	}, note.onset);
};

var normalize = function(array) {
	var min = getMin(array);
	var max = getMax(array);

	for (var i = 0; i < array.length; i++) {
		array[i] = (array[i] - min) / (max - min);
	}

	return array;
};

var playInstrument = function(config) {
	for (var i = 0; i < 7; i++) {
		var array = normalize(tagStyle[config.tag][i]);
		tagStyle[config.tag][i] = array;

		var min = getMin(array);
		if (min == Infinity || min === Infinity) {
			console.log("something gone wrong with min!");
		}

		var max = getMax(array);
		if (max == -Infinity || max === -Infinity) {
			console.log("something gone wrong with max!");
		}
	}

  for (var i = 0; i < tagHistogram[config.tag]; i++) {
		var note = {};
		note.synth = config.instrument;
		note.element = tags[config.tag][i];
    note.note = config.note.a * tagStyle[config.tag][config.note.x][i] + config.note.b;
    note.onset = config.onset.a * tagStyle[config.tag][config.onset.x][i] + config.onset.b;
		note.duration = config.duration.a * tagStyle[config.tag][config.duration.x][i] + config.duration.b;
		note.dynamics = config.dynamics.a * tagStyle[config.tag][config.dynamics.x][i] + config.dynamics.b;
		playNote(note);
	}
};

var start = function(data) {
  var n = 14;
  var k = data.length / n;
  for (var i = 0; i < k; i++) {
    var config = interpret(data.slice(i * n, i * n + (n + 1)));
    playInstrument(config);
  }
};

/* MAIN SECTION ***************************************************************/
var sonify = function(request, sender, sendResponse) {
  load(document.getElementsByTagName('body')[0]);
	start(request.data);
	browser.runtime.onMessage.removeListener(sonify);
};

browser.runtime.onMessage.addListener(sonify);
