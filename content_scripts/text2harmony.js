// http://www.hooktheory.com/blog/i-analyzed-the-chords-of-1300-popular-songs-for-patterns-this-is-what-i-found/
var key = {};
key['S'] = 'C';  // 26%
key['L'] = 'G';  // 12%
key['C'] = 'Eb'; // 10%
key['U'] = 'F';  // 9%
key['D'] = 'D';  // 8%
key['P'] = 'A';  // 8%
key['M'] = 'E';  // 7%
key['H'] = 'Db'; // 7%
key['G'] = 'Bb'; // 5%
key['B'] = 'Ab'; // 4%
key['F'] = 'B';  // 3%
key['Y'] = 'F#'; // 3%

// https://www3.nd.edu/~busiforc/handouts/cryptography/letterfrequencies.html
var notes = {};
notes['C'] = 0;   // C
notes['C#'] = 1;  // C#
notes['Db'] = 1;  // Db
notes['D'] = 2;   // D
notes['D#'] = 3;  // D#
notes['Eb'] = 3;  // Eb
notes['E'] = 4;   // E
notes['F'] = 5;   // F
notes['F#'] = 6;  // F#
notes['Gb'] = 6;  // Gb
notes['G'] = 7;   // G
notes['G#'] = 8;  // G#
notes['Ab'] = 8;  // Ab
notes['A'] = 9;   // A
notes['A#'] = 10; // A#
notes['Bb'] = 10; // Bb
notes['B'] = 11;  // B

var delta = Math.pow(2, 1 / 12);
console.log();

var interval = {};
interval['E'] = 0;  // I
interval['A'] = 2;  // II
interval['R'] = 4;  // III
interval['I'] = 5;  // IV
interval['O'] = 7;  // V
interval['T'] = 9;  // VI
interval['N'] = 11; // VII

interval['W'] = 12; // VIII
interval['K'] = 14; // IX
interval['V'] = 16; // X
interval['X'] = 17; // XI
interval['Z'] = 19; // XII
interval['J'] = 21; // XIII
interval['Q'] = 23; // XIV

var getMidi = function(note, octave) {
	return note + 12 * octave;
};

var midi2freq = function(midi) {
	return Math.pow(2, (midi - 69) / 12) * 440;
};

var trim = function(string) {
	var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
	return string.replace(rtrim, '');
};

var stop = function(synth, duration) {
	setTimeout(function() {
		synth.dispose();
	}, duration);
};

var play = function(key, octave, chord, duration) {
	var midi = getMidi(notes[key], octave);
	for (var i in chord) {
		var frequency = midi2freq(midi + chord[i]);
		var synth = new Tone.Synth();
		synth.toMaster();
		synth.triggerAttackRelease(frequency, duration / 1000.0);
		stop(synth, duration);
	}
};

var getDuration = function(word) {
	return word.length * 250;
};

var getKey = function(word) {
	for (var i in word) {
		if (word[i] in key) {
			return key[word[i]];
		}
	}
};

var sort_uniq = function(arr) {
	if (arr.length === 0) {
		return arr;
	}
	
	arr = arr.sort(function (a, b) { return a*1 - b*1; });
	
	var ret = [arr[0]];
	for (var i = 1; i < arr.length; i++) {
		if (arr[i-1] !== arr[i]) {
			ret.push(arr[i]);
		}
	}
	return ret;
};

var getChord = function(word) {
	var chord = [];
	for (var i in word) {
		if (word[i] in interval) {
			chord.push(interval[word[i]]);
		}
	}
	if (chord.length == 0) {
		console.log(word);
	}
	return sort_uniq(chord);
};

var word2chord = function(words, i) {
	if (i < words.length) {
		var word = words[i].toUpperCase();
		var duration = getDuration(word);
		var key = getKey(word);
		var chord = getChord(word);
		if (key !== undefined) {
			// FIXME: fixed octave!
			play(key, 4, chord, duration);
		}
		setTimeout(function() {
			word2chord(words, i + 1);
		}, duration);
	}
};

var selection = window.getSelection().toString();
if (selection) {
	var words = trim(selection).split(" ");
	word2chord(words, 0);
} else {
	alert("Please, select some text! =)");
}

