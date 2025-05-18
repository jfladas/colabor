chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "mouse_position") {
        const url = new URL(sender.tab.url);
        const domain = url.hostname.split('.').slice(-2).join('.');
        const mouseData = {
            x: message.x,
            y: message.y,
            domain: domain,
            timestamp: Date.now()
        };
        chrome.storage.local.get({ mousePositions: [] }, (result) => {
            const updatedData = result.mousePositions;
            updatedData.push(mouseData);
            chrome.storage.local.set({ mousePositions: updatedData });
        });
    }
    if (message.type === "mouse_click") {
        const url = new URL(sender.tab.url);
        const domain = url.hostname.split('.').slice(-2).join('.');
        const mouseData = {
            x: message.x,
            y: message.y,
            domain: domain,
            timestamp: Date.now()
        };
        chrome.storage.local.get({ mouseClicks: [] }, (result) => {
            const updatedData = result.mouseClicks;
            updatedData.push(mouseData);
            chrome.storage.local.set({ mouseClicks: updatedData });
        });
    }
});

chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({ url: chrome.runtime.getURL("heatmap.html") });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ mousePositions: [], mouseClicks: [] });
});