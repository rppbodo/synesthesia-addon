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

var playNote = function(note, autoScroll) {
	setTimeout(function() {
		var synth = synthFactory(note.synth);
		synth.play(note.note, note.dynamics);

		if (autoScroll) {
			note.element.scrollIntoView(true);
		}

		addClass(note.element, "sonification-addon-highlight");

		setTimeout(function () {
			synth.stop();
			synth = undefined;
			removeClass(note.element, "sonification-addon-highlight");
		}, note.duration);
	}, note.onset);
};

var playInstrument = function(config, onsetAutoMap, autoScroll) {
	normalizeAll(config);

	var onset = 0;
	for (var i = 0; i < tagHistogram[config.tag]; i++) {
		var note = generateNote(config, i, onsetAutoMap, onset);
		playNote(note, autoScroll);
		onset = onset + note.duration;
	}
};

var startSonification = function(data, autoScroll, onsetAutoMap) {
	var n = 14;
	if (onsetAutoMap) {
		n = 11;
	}
	var k = data.length / n;
	for (var i = 0; i < k; i++) {
		var config = interpret(data.slice(i * n, i * n + (n + 1)), onsetAutoMap);
		playInstrument(config, onsetAutoMap, autoScroll);
	}
};

var sonify = function(request, sender, sendResponse) {
	init();
	loadHtml(document.getElementsByTagName('body')[0]);
	startSonification(request.data, request.autoScroll, request.onsetAutoMap);
	
	browser.runtime.onMessage.removeListener(sonify);
};

browser.runtime.onMessage.addListener(sonify);

