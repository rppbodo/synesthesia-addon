function Pong(context){
	this.context = context;
	this.oscillator = this.context.createOscillator();
	this.lfo = this.context.createOscillator();
	this.lfoGain = this.context.createGain();
	this.envelope = new Envelope(context, 10, 10, 10, 10, 0.5);
	this.playing = false;
	this.oscillator.start(0);
	this.lfo.start(0);
}

Pong.prototype.play = function(note, dynamic) {
	if (this.playing == true)
		return;
	this.playing = true;
	this.lfoGain.gain.value = 1000;
	this.lfo.frequency.value = 10; // value in hertz
	
	this.oscillator.type = 'sine';
	this.oscillator.frequency.value = midi[note]; // value in hertz
	this.oscillator.connect(this.envelope.node);
	
	this.dynamics = this.context.createGain();
	this.dynamics.gain.value = (isNaN(dynamic))?1:dynamic;
	this.envelope.connect(this.dynamics);
	this.dynamics.connect(this.context.destination);
	
	this.lfo.connect(this.lfoGain);
	this.lfoGain.connect(this.oscillator.frequency);
	this.envelope.play(this);
};

Pong.prototype.stop = function(time){
	this.lfoGain.disconnect();
	this.oscillator.disconnect();
	this.envelope.disconnect();
	this.playing = false;
	this.dynamics.disconnect();
};
