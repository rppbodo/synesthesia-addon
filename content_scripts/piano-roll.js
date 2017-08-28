var nKeys = 128;
var keyHeight = 20;
var epsilon = 10;
var canvasWidth = 1500 + 2 * epsilon;
var canvasHeight = 2560 + 2 * epsilon;

var blackKey = function(index) {
	var i = index % 12;
	if (i == 1 || i == 3 || i == 6 || i == 8 || i == 10) {
		return 1;
	}
	return 0;
};

var drawPiano = function() {
	var canvas = document.createElement("canvas");
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	var context = canvas.getContext("2d");

	context.fillStyle = "#FFF";
	context.fillRect(0, 0, canvas.width, canvas.height);

	for (var i = 0; i < nKeys; i++) {
		var y = (127 - i) * keyHeight + epsilon;
		if (blackKey(i)) {
			// key
			context.fillStyle = "#000";
			context.fillRect(epsilon, y, 125, keyHeight);
			// grid
			context.fillStyle = "#999";
			context.fillRect(epsilon + 200, y, 1300, keyHeight);
		} else {
			// key
			context.strikeStyle = "#000";
			context.rect(epsilon, y, 200, keyHeight);
			context.stroke();
			// grid
			context.rect(epsilon + 200, y, 1300, keyHeight);
			context.stroke();
		}
	}

	return [canvas, context];
};

var drawNote = function(note, canvas, context) {
	var color = "#FF8000";
	if (note.synth == 0) {
		color = "#80FF00";
	} else if (note.synth == 1) {
		color = "#00FF80";
	} else if (note.synth == 2) {
		color = "#0080FF";
	} else if (note.synth == 3) {
		color = "#8000FF";
	} else if (note.synth == 4) {
		color = "#FF0080";
	}
	context.fillStyle = color;
	context.fillRect(note.onset + epsilon, (127 - note.note) * keyHeight + epsilon + 1, note.duration, keyHeight - 2);
};

var drawInstruments = function(data, canvas, context) {
	var notes = [];
	var n = 14;
	var k = data.length / n;
	for (var i = 0; i < k; i++) {
		var config = interpret(data.slice(i * n, i * n + (n + 1)));

		normalizeAll(config);

		for (var j = 0; j < tagHistogram[config.tag]; j++) {
			notes.push(generateNote(config, j));
		}
	}

	var min = getMin(notes, "onset");
	var max = getMax(notes, "onset");

	var min_ = getMin(notes, "duration");
	var max_ = getMax(notes, "duration");

	var minDuration = 10;
	var maxDuration = 100;

	var minOnset = 200;
	var maxOnset = (canvasWidth - epsilon) - maxDuration;

	for (var i = 0; i < notes.length; i++) {
		notes[i].onset = ((notes[i].onset - min) / (max - min)) * (maxOnset - minOnset) + minOnset;
		notes[i].duration = ((notes[i].duration - min_) / (max_ - min_)) * (maxDuration - minDuration) + minDuration;
	}

	for (var i = 0; i < notes.length; i++) {
		drawNote(notes[i], canvas, context);
	}
};

var pianoRoll = function(request, sender, sendResponse) {
	init();
	loadHtml(document.getElementsByTagName('body')[0]);
	var array = drawPiano();
	var canvas = array[0];
	var context = array[1];
	drawInstruments(request.data, canvas, context);
	var blob = dataURItoBlob(canvas.toDataURL(), "image/png");
	saveAs(blob, window.location.host.replace("www.", "") + ".png");
	browser.runtime.onMessage.removeListener(pianoRoll);
};

browser.runtime.onMessage.addListener(pianoRoll);
