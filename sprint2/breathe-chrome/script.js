let head = document.getElementsByTagName('head')[0];
let link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = chrome.runtime.getURL("style.css");
link.media = 'all';
head.appendChild(link);

let div = document.createElement('div');
div.id = 'overlay1';
document.body.appendChild(div);

let div2 = document.createElement('div');
div2.id = 'overlay2';
document.body.appendChild(div2);

let textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, li, img');
textElements.forEach(element => {
    if (element.childElementCount > 0) {
        return;
    }
    element.dataset.originalText = element.innerHTML;
    element.style.transition = 'color 5s ease, font-weight 5s ease, transform 5s ease';
    element.style.fontFamily = 'Georgia, sans-serif';
});
breatheIn();

function breatheIn() {
    textElements.forEach(element => {
        if (element.childElementCount > 0) {
            return;
        }
        element.innerHTML = 'BREATHE IN';
        element.style.color = '#00ffaa';
        element.style.fontWeight = '900';
        element.style.transform = 'scale(3)';
    });

    setTimeout(() => {
        breatheOut();
    }, 5000);
}

function breatheOut() {
    textElements.forEach(element => {
        if (element.childElementCount > 0) {
            return;
        }
        element.innerHTML = 'BREATHE OUT';
        element.style.color = '#0055ff';
        element.style.fontWeight = '100';
        element.style.transform = 'scale(1)';
        /*
        if (element.dataset.originalText) {
            element.innerHTML = element.dataset.originalText;
            delete element.dataset.originalText;
        }
        */
    });

    setTimeout(() => {
        breatheIn();
    }, 5000);
}