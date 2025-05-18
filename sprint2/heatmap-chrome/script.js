window.addEventListener("mousemove", function (e) {
    chrome.runtime.sendMessage({
        type: "mouse_position",
        x: e.clientX,
        y: e.clientY
    });
});

window.addEventListener("click", function (e) {
    chrome.runtime.sendMessage({
        type: "mouse_click",
        x: e.clientX,
        y: e.clientY
    });
});