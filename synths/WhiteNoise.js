WhiteNoise = function(context) {
  var that = this;
  this.x = 0; // Initial sample number
  this.context = context;
  this.node = context.createScriptProcessor(1024, 0, 1);
  this.node.onaudioprocess = function(e) { that.process(e) };
}

WhiteNoise.prototype.process = function(e) {
  var data = e.outputBuffer.getChannelData(0);
  for (var i = 0; i < data.length; ++i) {
      data[i] = (Math.random() * 2) - 1;
  }
}

WhiteNoise.prototype.connect = function(src) {
  this.node.connect(src);
}


WhiteNoise.prototype.stop = function() {
  this.node.disconnect();
}
