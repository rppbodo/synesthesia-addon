function Guitar(context){
	this.context = context;
	this.node = this.context.createScriptProcessor(1024, 0, 1);
	this.envelope = new Envelope(context, 300, 100, 300, 1000, 0.7);
	this.distortion = this.context.createWaveShaper();
}

Guitar.prototype.play = function(note, dynamic) {
	var frequency = midi[note];
	var impulse = 0.0001 * this.context.sampleRate;
	var N = Math.round(this.context.sampleRate / frequency);
	var y = new Float32Array(N);
	var n = 0;
	this.node.onaudioprocess = function (e) {
		var output = e.outputBuffer.getChannelData(0);
		for (var i = 0; i < e.outputBuffer.length; ++i) {
			var xn = (--impulse >= 0) ? Math.random()-0.5 : 0;
			output[i] = y[n] = xn + (y[n] + y[(n + 1) % N]) / 2;
			if (++n >= N) n = 0;
		}
	}

	this.dynamics = this.context.createGain();
	this.dynamics.gain.value = (isNaN(dynamic))?1:dynamic;
	this.distortion.curve = makeDistortionCurve(1000);
	this.envelope.connect(this.distortion);
	this.distortion.connect(this.dynamics);
	this.dynamics.connect(this.context.destination);
	this.node.connect(this.envelope.node);
	this.envelope.play(this);
};

Guitar.prototype.stop = function(time){
	this.node.disconnect();
	this.envelope.disconnect();
	this.dynamics.disconnect();
};
