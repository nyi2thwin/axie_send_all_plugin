let sendButton = document.getElementById('sendButton');
chrome.windows.getCurrent(function (currentWindow) {
	chrome.tabs.query({ active: true, windowId: currentWindow.id }, function (activeTabs) {
        activeTabs.map(function (tab) {
        	chrome.tabs.executeScript(tab.id, {file: 'inject.js'});
        });
    });
});
chrome.storage.sync.get(['eth_address'], function(result) {
 	console.log('eth_address currently is ' + result.eth_address);
 	if(typeof result.eth_address != 'undefined'){
 		document.getElementById("eth_address").value = result.eth_address;
 	}
});
sendButton.onclick = function(element) {
	
	document.getElementById('sendButton').innerHTML = "Sending...";
	document.getElementById('sendButton').disabled = true;
	var eth_address = document.getElementById('eth_address').value;
	var num_of_attack = parseInt(document.getElementById('num_of_attack').value);
	chrome.storage.sync.set({eth_address: eth_address}, function() {
    	console.log('eth_address is set to ' + eth_address);
    });
	chrome.windows.getCurrent(function (currentWindow) {
    	chrome.tabs.query({ active: true, windowId: currentWindow.id }, function (activeTabs) {
	        activeTabs.map(function (tab) {
	            chrome.tabs.executeScript(tab.id, {
				    code: 'run_attack("'+eth_address+'",'+num_of_attack+');'
				}, function() {
					setTimeout(function(){ 
						document.getElementById('sendButton').innerHTML = "Send"; 
						document.getElementById('sendButton').disabled = false;
					}, 4000);
					
					
				    //chrome.tabs.executeScript(tab.id, {file: 'inject.js'});
				});
	        });
	    });
	});	
};