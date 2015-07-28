chrome.browserAction.onClicked.addListener(function() {
    console.log("alert from background.js");
    chrome.tabs.executeScript({file: "./salesdriver.js"}, function() {
        console.log("salesdriver Loaded");
    });
});