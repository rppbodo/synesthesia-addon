var tempo = 120;
var base_duration = 4 * (1000 / (tempo / 60)); // We are considering (for now) a time signature of 4/4
var note_duration = 1/4;

var letter2note = {};
letter2note['E'] = 'C';
letter2note['A'] = 'C#';
letter2note['R'] = 'D';
letter2note['I'] = 'D#';
letter2note['O'] = 'E';
letter2note['T'] = 'F';
letter2note['N'] = 'F#';
letter2note['S'] = 'G';
letter2note['L'] = 'G#';
letter2note['C'] = 'A';
letter2note['U'] = 'A#';
letter2note['D'] = 'B';

// https://www3.nd.edu/~busiforc/handouts/cryptography/letterfrequencies.html
var notes = {};
notes['C'] = 0;  // C
notes['C#'] = 1;  // C#
notes['D'] = 2;  // D
notes['D#'] = 3;  // D#
notes['E'] = 4;  // E
notes['F'] = 5;  // F
notes['F#'] = 6;  // F#
notes['G'] = 7;  // G
notes['G#'] = 8;  // G#
notes['A'] = 9;  // A
notes['A#'] = 10; // A#
notes['B'] = 11; // B

var durations = {};
durations['Y'] = 2;    // breve
durations['B'] = 1;    // semibreve
durations['H'] = 1/2;  // minima
durations['P'] = 1/4;  // seminima
durations['M'] = 1/8;  // colcheia
durations['G'] = 1/16  // semicolcheia
durations['F'] = 1/32; // fusa
durations['W'] = 1/64; // semifusa

var symbols = {};
symbols['Y'] = "double-whole";  // breve
symbols['B'] = "whole";         // semibreve
symbols['H'] = "half";          // minima
symbols['P'] = "quarter";       // seminima
symbols['M'] = "eighth";        // colcheia
symbols['G'] = "sixteenth";     // semicolcheia
symbols['F'] = "thirty-second"; // fusa
symbols['W'] = "sixty-fourth";  // semifusa

/*
K
V
X
Z
J
Q
*/

var getFrequency = function(note, octave) {
	return midi2freq(note + 12 * octave);
};

var midi2freq = function(midi) {
	return Math.pow(2, (midi - 69) / 12) * 440;
};

var trim = function(string) {
	var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
	return string.replace(rtrim, '');
};

var isNote = function(char) {
	return char.toUpperCase() in letter2note;
};

var getNote = function(char) {
	return notes[letter2note[char.toUpperCase()]];
};

var isDuration = function(char) {
	return char.toUpperCase() in durations;
};

var getDuration = function(char) {
	return durations[char.toUpperCase()];
};

var getOctave = function(char) {
	return char.charCodeAt() % 10;
};

var play = function(letters, i, duration) {
	if (i < letters.length - 1) {
		if (isNote(letters[i])) {
			var note = getNote(letters[i]);
			var octave = getOctave(letters[i + 1]);
			var frequency = getFrequency(note, octave);
			var duration_ms = base_duration * duration;
			
			console.log("playing", letter2note[letters[i].toUpperCase()] + octave, "for", duration_ms, "ms");
			var synth = new Tone.Synth();
			synth.toMaster();
			synth.triggerAttackRelease(frequency, duration_ms / 1000.0);
						
			setTimeout(function() {
				synth.dispose();
				play(letters, i + 1, duration);
			}, duration_ms);
		} else if (isDuration(letters[i])) {
			var new_duration = getDuration(letters[i]);
			console.log("change note duration to", new_duration);
			play(letters, i + 1, new_duration);
		} else {
			console.log("unmapped char '" + letters[i] + "'");
			play(letters, i + 1, duration);
		}
	}
};

var selection = window.getSelection().toString();
if (selection) {
	play(selection, 0, note_duration);
} else {
	alert("Please, select some text! =)");
}

