browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "mouse_position") {
        const url = new URL(sender.tab.url);
        const domain = url.hostname.split('.').slice(-2).join('.');
        console.log("Mouse position:", message.x, message.y, "from site:", domain);
        const mouseData = {
            x: message.x,
            y: message.y,
            domain: domain,
            timestamp: Date.now()
        };
        browser.storage.local.get({ mousePositions: [] }, (result) => {
            const updatedData = result.mousePositions;
            updatedData.push(mouseData);
            browser.storage.local.set({ mousePositions: updatedData });
        });
    }
    if (message.type === "mouse_click") {
        const url = new URL(sender.tab.url);
        const domain = url.hostname.split('.').slice(-2).join('.');
        console.log("Mouse click:", message.x, message.y, "from site:", domain);
        const mouseData = {
            x: message.x,
            y: message.y,
            domain: domain,
            timestamp: Date.now()
        };
        browser.storage.local.get({ mouseClicks: [] }, (result) => {
            const updatedData = result.mouseClicks;
            updatedData.push(mouseData);
            browser.storage.local.set({ mouseClicks: updatedData });
        });
    }
});

browser.browserAction.onClicked.addListener((tab) => {
    browser.tabs.create({ url: browser.runtime.getURL("heatmap.html") });
});

browser.runtime.onInstalled.addListener(() => {
    browser.storage.local.set({ mousePositions: [], mouseClicks: [] });
});