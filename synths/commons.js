var midi = [];
for (var i = 0; i < 127; i++) {
	var arg = ((parseFloat(i) - 69.0)/12.0);
	midi[i] = Math.pow(2.0, arg) * 440.0;
}

function Envelope(context, a, d, s, r, g) {
	this.node = context.createGain()
	this.context = context;
	this.node.gain.value = 0;
	this.a = a / 1000.0;
	this.d = d / 1000.0;
	this.s = s / 1000.0;
	this.r = r / 1000.0;
	this.g = g;
}

Envelope.prototype.play = function(obj) {
	var time = this.context.currentTime;
	this.node.gain.cancelScheduledValues(time);
	this.node.gain.linearRampToValueAtTime(0, time);
	time += this.a;
	this.node.gain.linearRampToValueAtTime(1, time);
	time += this.d;
	this.node.gain.linearRampToValueAtTime(0.5, time);
	time += this.s;
	time += this.r;
	this.node.gain.linearRampToValueAtTime(0, time);
	var noteTime = this.a + this.d + this.s + this.r;
	noteTime *= 1000.0;
	setTimeout(function(){obj.stop()}, noteTime);
};

Envelope.prototype.connect = function(src) {
	this.node.connect(src);
};

Envelope.prototype.disconnect = function() {
	this.node.disconnect();
};

function makeDistortionCurve( amount ) {
	var k = typeof amount === 'number' ? amount : 50,
		nSamples = 44100,
		curve = new Float32Array(nSamples),
		deg = Math.PI / 180,
		i = 0,
		x;
	for ( ; i < nSamples; ++i ) {
		x = i * 2 / nSamples - 1;
		curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
	}
	return curve;
};

