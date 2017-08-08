'use strict';

var tagHistogram = {};

var load = function(element) {
	if (isVisible(element)) {
		if (element.tagName in tagHistogram) {
			tagHistogram[element.tagName] += 1;
		} else {
			tagHistogram[element.tagName] = 1;
		}
	}

	var children = element.childNodes;
	if (children.length != 0) {
		var i;
		for (i = 0; i < children.length; i++) {
			var item = children[i];
			if (item.nodeType == ELEMENT_NODE) {
				load(item);
			}
		}
	}
};

var tags = function(request, sender, sendResponse) {
	load(document.getElementsByTagName('body')[0]);
	browser.runtime.onMessage.removeListener(tags);
	var response = Object.keys(tagHistogram).sort(function(a,b) { return tagHistogram[b] - tagHistogram[a] }).slice(0, request.nTags);
	return Promise.resolve({ response: response });
};

browser.runtime.onMessage.addListener(tags);
