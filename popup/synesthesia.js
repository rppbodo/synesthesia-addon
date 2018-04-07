document.addEventListener("click", (e) => {
	if (e.target.id == "go") {
		var type = getCheckedRadio("sonification-type");
		document.getElementById(type + "-content").style.display = "block";
		document.getElementById("main-content").style.display = "none";
	} else if (e.target.id == "back") {
		var divs = [].slice.call(document.getElementsByClassName("content"));
		divs.forEach(function(element) {
			element.style.display = "none";
		});
		document.getElementById("main-content").style.display = "block";
	} else if (e.target.id == "tags") {
		var onsetAutoMap = document.getElementById("onset-auto-map").checked;
		
		browser.tabs.executeScript(null, {
			file: "/content_scripts/tags.js"
		});

		var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
		gettingActiveTab.then((tabs) => {
			browser.tabs.sendMessage(tabs[0].id,
			{ nTags: document.getElementById("n-tags").value }).then(response => {
				var html = "<button id=\"sonify\">sonify!</button>";
				html += "<ol>";
				var tag;
				for (tag in response.response) {
					html += "<li>" + response.response[tag] + "</li>";
					html += getMappings(onsetAutoMap);
				}
				html += "</ol>";
				document.getElementById("tag-list").innerHTML = html;
			});
		});
	} else if (e.target.id == "sonify") {
		var autoScroll = document.getElementById("auto-scroll").checked;
		var onsetAutoMap = document.getElementById("onset-auto-map").checked;

		browser.tabs.executeScript(null, {
			file: "/content_scripts/sonify.js"
		});

		var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
		gettingActiveTab.then((tabs) => {
			browser.tabs.sendMessage(tabs[0].id, {
				autoScroll: autoScroll,
				onsetAutoMap: onsetAutoMap,
				data: generateData()
			});
		});
	} else if (e.target.id == "text2melody") {
		browser.tabs.executeScript(null, {
			file: "/content_scripts/text2melody.js"
		});
		
	} else if (e.target.id == "text2harmony") {
		browser.tabs.executeScript(null, {
			file: "/content_scripts/text2harmony.js"
		});
		
	}
});

