window.addEventListener("mousemove", function (e) {
    browser.runtime.sendMessage({
        type: "mouse_position",
        x: e.clientX,
        y: e.clientY
    });
});