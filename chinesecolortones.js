// Nathan Dummitt colors
var first = '#F41D2F';
var second = '#F9761B';
var third = '#97CD5D';
var fourth = '#589BC8';

var elements = document.getElementsByTagName('body');

for (var i = 0; i < elements.length; ++i) {
	loopAndReplaceChinese(elements[i]);
}

function getChineseCharacterTone(character) {
	for (var i = 0; i < chineseTones.length; ++i) {
		if (chineseTones[i].character === character) {
			return chineseTones[i].tone;
		}
	}
	
	// -1 will be the error code.
	return -1;
}

function loopAndReplaceChinese(element) {
	for (var i = 0; i < element.childNodes.length; ++i) {
		var node = element.childNodes[i];
		
		if (node.nodeType === 3) {
			var text = node.nodeValue;
			var tmpText = "";
			var newElements = [];
			var chineseFound = false;
			
			for (var k = 0; k < text.length; k++) {
				if (text.charCodeAt(k) >= 0x4E00 && text.charCodeAt(k) <= 0xFA29) {
					// Get the character's tone (tone could be wrong)
					var tone = getChineseCharacterTone(text[k]);
					
					if (tone > -1) {
						// Add the non-Chinese text
						var textElement = document.createTextNode(tmpText);
						tmpText = "";
						newElements.push(textElement);
						
						var chineseElement = document.createElement('span');
						chineseElement.innerText = text[k];
						chineseElement.classList.add('colortones');
						
						if (tone === 1) {
							chineseElement.style.color = first;
						} else if (tone === 2) {
							chineseElement.style.color = second;
						} else if (tone === 3) {
							chineseElement.style.color = third;
						} else if (tone === 4) {
							chineseElement.style.color = fourth;
						}
						// for now we don't change fifth tone
						
						newElements.push(chineseElement);
						
						chineseFound = true;
					} else {
						tmpText += text[k];
					}
				} else {
					tmpText += text[k];
				}
			}
			
			if (chineseFound) {
				if (tmpText.length > 0) {
					var textElement = document.createTextNode(tmpText);
					tmpText = "";
					newElements.push(textElement);
				}
				
				var container = document.createElement('span');
				
				for (var k = 0; k < newElements.length; k++) {
					container.appendChild(newElements[k]);
				}
				
				element.replaceChild(container, node);
			}
		} else if (node.hasChildNodes()) {
			if (node.nodeType === 1 && node.classList.contains('colortones')) {
				continue;
			}
			
			loopAndReplaceChinese(node);
		}
	}
}

var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		if (mutation.type === "characterData") {
			console.log(mutation.target.data);
		} else if (mutation.type === "childList") {
			for (var i = 0; i < mutation.addedNodes.length; ++i) {
				var node = mutation.addedNodes[i];
				
				if (node.nodeType === 1) {
					if (!node.classList.contains('colortones')) {
						// TODO: Loop children
						//console.log(node.nodeValue);
						loopAndReplaceChinese(node);
					}
				}
			}
		}
	});
});

observer.observe(document.documentElement, { childList: true, subtree: true });
