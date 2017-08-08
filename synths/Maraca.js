function Maraca(context){
	this.context = context;
	this.envelope = new Envelope(context, 40, 0, 60, 80, 0.5);
}

Maraca.prototype.play = function(note, dynamic) {
	this.whiteNoise = new WhiteNoise(this.context);
	this.filter = context.createBiquadFilter();
	this.lfo = context.createOscillator();
	this.lfoGain = context.createGain();

	this.lfo.frequency.value = 1;
	this.lfo.connect(this.lfoGain);
	this.lfo.start(0);

	this.lfoGain.gain.value = 2000;
	this.lfoGain.connect(this.filter.frequency);

	this.filter.type = 'bandpass';
	this.filter.frequency.value = 200;
	this.filter.gain.value = 20;
	this.filter.Q.value = 0.2;
	this.filter.connect(this.envelope.node);

	this.dynamics = this.context.createGain();
	this.dynamics.gain.value = (isNaN(dynamic))?1:dynamic;
	
	this.envelope.connect(this.dynamics);
	this.dynamics.connect(this.context.destination);
	this.envelope.play(this);

	this.whiteNoise.connect(this.filter);
};

Maraca.prototype.stop = function(time){
	this.lfo.stop(0);
	this.envelope.disconnect();
	this.whiteNoise.stop(0);
	this.dynamics.disconnect();
};
