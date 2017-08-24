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
		synth.play(note.note, note.dynamics);

		note.element.scrollIntoView(true);
		addClass(note.element, "sonification-addon-highlight");

	  setTimeout(function () {
	    synth.stop();
	    synth = undefined;
	    // removeClass(note.element, "sonification-addon-highlight");
	  }, note.duration);
	}, note.onset);
};

var playInstrument = function(config) {
	normalizeAll(config);

  for (var i = 0; i < tagHistogram[config.tag]; i++) {
		playNote(generateNote(config, i));
	}
};

var startSonification = function(data) {
  var n = 14;
  var k = data.length / n;
  for (var i = 0; i < k; i++) {
    var config = interpret(data.slice(i * n, i * n + (n + 1)));
    playInstrument(config);
  }
};

var sonify = function(request, sender, sendResponse) {
	init();
	load(document.getElementsByTagName('body')[0]);
	startSonification(request.data);
	browser.runtime.onMessage.removeListener(sonify);
};

browser.runtime.onMessage.addListener(sonify);
