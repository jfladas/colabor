window.addEventListener("mousemove", function (e) {
    browser.runtime.sendMessage({
        type: "mouse_position",
        x: e.clientX,
        y: e.clientY
    });
});

window.addEventListener("click", function (e) {
    browser.runtime.sendMessage({
        type: "mouse_click",
        x: e.clientX,
        y: e.clientY
    });
});