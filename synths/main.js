var synthFactory = function(synth) {
	context = new (window.AudioContext || window.webkitAudioContext)();
	if (synth == 0) { return new Block(context); }
	if (synth == 1) { return new Drum(context); }
	if (synth == 2) { return new Guitar(context); }
	if (synth == 3) { return new Harpsichord(context); }
	if (synth == 4) { return new Maraca(context); }
	if (synth == 5) { return new Pong(context); }
};
