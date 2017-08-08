function Drum(context){
	this.context = context;
	this.envelope = new Envelope(context, 2, 1, 3, 10, 0.5);
}

Drum.prototype.play = function(note, dynamic) {
	this.oscillator = this.context.createOscillator();
	this.oscillator.type = 'sine';
	this.oscillator.frequency.value = midi[note]; // value in hertz
	
	this.dynamics = this.context.createGain();
	this.dynamics.gain.value = (isNaN(dynamic))?1:dynamic;

	this.oscillator.connect(this.envelope.node);
	this.envelope.connect(this.dynamics);
	this.dynamics.connect(this.context.destination);
	
	this.oscillator.start(0);
	this.envelope.play(this);
};

Drum.prototype.stop = function(time) {
	this.oscillator.stop(0);
	this.oscillator.disconnect();
	this.envelope.disconnect();
	this.dynamics.disconnect();
};

