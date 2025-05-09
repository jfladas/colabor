let head = document.getElementsByTagName('head')[0];

let brokenness = 0;

document.addEventListener('click', function (event) {
    console.log('Element clicked:', event.target);
    let element = event.target;
    brokenness++;
    if (element.clientHeight < window.innerHeight / 2) {
        if (Math.random() < 0.5) {
            fallElement(element);
        } else {
            corruptElement(element);
        }
    } else {
        console.log('Element is too tall');
    }
    if (Math.random() < 0.5) {
        crackScreen(event.pageX, event.pageY);
    }
    if (brokenness > 10) {
        showBSOD();
    }
});

function fallElement(element) {
    element.style.position = 'fixed';
    element.style.pointerEvents = 'none';
    let top = element.getBoundingClientRect().top - window.scrollY;
    let velocity = 0;
    let acceleration = 0.5;
    let fallInterval = setInterval(function () {
        velocity += acceleration;
        top += velocity;
        element.style.top = top + 'px';
        if (top > window.innerHeight - element.offsetHeight) {
            clearInterval(fallInterval);
        }
    }, 20);
}

function corruptElement(element) {
    let tag = element.tagName.toLowerCase();
    switch (tag) {
        case 'p':
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
        case 'span':
        case 'li':
            let text = element.textContent;
            let length = text.length;
            let index = 0;

            let corruptionInterval = setInterval(function () {
                if (index >= length) {
                    clearInterval(corruptionInterval);
                    return;
                }
                let randomChar = String.fromCharCode(33 + Math.floor(Math.random() * 94));
                if (text[index] === ' ') {
                    index++;
                    return;
                }
                text = text.substring(0, index) + randomChar + text.substring(index + 1);
                element.textContent = text;
                index++;
            }, 10);
            break;
        case 'img':
            // Corrupt image
            break;
        default:
            fallElement(element);
            break;
    }
}

function crackScreen(x, y) {
    let crack = document.createElement('img');
    crack.src = browser.runtime.getURL(`assets/crack.png`);
    crack.style.position = 'fixed';
    crack.style.left = x + 'px';
    crack.style.top = y + 'px';
    crack.style.pointerEvents = 'none';
    crack.style.zIndex = '9999';
    crack.style.width = '100px';
    crack.style.height = 'auto';
    crack.style.transform = 'translate(-50%, -50%) rotate(' + (Math.random() * 360) + 'deg) scale(' + (Math.random() + 1) + ')';

    document.body.appendChild(crack);
}

function showBSOD() {
    let bsod = document.createElement('div');
    bsod.style.position = 'fixed';
    bsod.style.left = '0';
    bsod.style.top = '0';
    bsod.style.width = '100%';
    bsod.style.height = '100%';
    bsod.style.backgroundColor = '#0000FF';
    bsod.style.fontFamily = 'monospace';
    bsod.style.fontSize = '50px';
    bsod.style.textAlign = 'center';
    bsod.style.zIndex = '9999';
    bsod.style.color = 'white';
    bsod.style.display = 'flex';
    bsod.style.flexDirection = 'column';
    bsod.style.justifyContent = 'center';
    bsod.style.alignItems = 'center';
    let smile = document.createElement('div');
    smile.style.fontSize = '200px';
    smile.style.marginBottom = '50px';
    smile.textContent = ':(';
    bsod.appendChild(smile);
    let message = document.createElement('div');
    message.textContent = 'You should consider taking a break.';
    bsod.appendChild(message);

    document.body.appendChild(bsod);
}