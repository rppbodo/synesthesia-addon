'use strict';

var ELEMENT_NODE = 1;
var ATTRIBUTE_NODE = 2;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;

(function() {
	'use strict';
	var api;
	api = function(x,y) {
		var elm, scrollX, scrollY, newX, newY;
		scrollX = window.pageXOffset;
		scrollY = window.pageYOffset;
		window.scrollTo(x,y);
		newX = x - window.pageXOffset;
		newY = y - window.pageYOffset;
		elm = this.elementFromPoint(newX,newY);
		window.scrollTo(scrollX,scrollY);
		return elm;
	};
	this.document.elementFromAbsolutePoint = api;
}).call(this);

(function() {
	'use strict';
	var map;
	map = function(inMin, inMax, outMin, outMax) {
		return (this - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
	};
	Number.prototype.map = map;
}).call(this);

var isVisible = function(element) {
	if (element.offsetWidth == 0 || element.offsetHeight == 0) {
		return false;
	}

	var rect = element.getBoundingClientRect();

	var top = rect.top;
	var left = rect.left;
	var topLeft = document.elementFromAbsolutePoint(left + 1, top + 1);

	var bottom = top + element.offsetHeight;
	var right = left + element.offsetWidth;
	var bottomRight = document.elementFromAbsolutePoint(right - 1, bottom - 1);

	return (topLeft === element) && (bottomRight === element);
};

var getMax = function(array) {
	var max = -Infinity;
	for (var i = 0; i < array.length; i++) {
		if (array[i] > max) {
			max = array[i];
		}
	}
	return max;
};

var getMin = function(array) {
	var min = Infinity;
	for (var i = 0; i < array.length; i++) {
		if (array[i] < min) {
			min = array[i];
		}
	}
	return min;
};

var getNumber = function(measure) {
	return parseInt(measure.replace(/[^-\d\.]/g, '')) || 0;
};

var sumNumbers = function(measure) {
	var parts = measure.split(" ");
	var sum = 0;
	var i;
	for (i = 0; i < parts.length; i++) {
		sum += getNumber(parts[i]);
	}
	return sum;
};

var getPadding = function(style) {
	var p = sumNumbers(style.padding);
	var pt = getNumber(style.paddingTop);
	var pl = getNumber(style.paddingLeft);
	var pb = getNumber(style.paddingBottom);
	var pr = getNumber(style.paddingRight);
	return p + pt + pl + pb + pr;
};

var getBorderWidth = function(style) {
	var bw = sumNumbers(style.borderWidth);
	var btw = getNumber(style.borderTopWidth);
	var blw = getNumber(style.borderLeftWidth);
	var bbw = getNumber(style.borderBottomWidth);
	var brw = getNumber(style.borderRightWidth);
	return bw + btw + blw + bbw + brw;
};

var getMargin = function(style) {
	var m = sumNumbers(style.margin);
	var mt = getNumber(style.marginTop);
	var ml = getNumber(style.marginLeft);
	var mb = getNumber(style.marginBottom);
	var mr = getNumber(style.marginRight);
	return m + mt + ml + mb + mr;
};
