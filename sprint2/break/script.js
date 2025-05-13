function initializeMatterJS() {
    if (typeof Matter === 'undefined') {
        console.error('Matter.js is not defined');
        return;
    }
    const { Engine, Render, World, Bodies, Runner, Body, Events } = Matter;
    const engine = Engine.create();
    const world = engine.world;
    const runner = Runner.create();
    Runner.run(runner, engine);

    const elementBodyMap = new Map();
    const corruptedElements = new Set();

    const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 30, window.innerWidth, 60, {
        isStatic: true
    });
    World.add(world, ground);

    function updatePositions() {
        elementBodyMap.forEach((body, element) => {
            element.style.position = 'fixed';
            element.style.pointerEvents = 'none';
            element.style.left = (body.position.x - element.offsetWidth / 2) + 'px';
            element.style.top = (body.position.y - element.offsetHeight / 2) + 'px';
            element.style.transform = `rotate(${body.angle}rad)`;
            element.style.width = body.bounds.max.x - body.bounds.min.x + 'px';
            element.style.height = body.bounds.max.y - body.bounds.min.y + 'px';
        });
        requestAnimationFrame(updatePositions);
    }
    updatePositions();

    function fallElement(element) {
        if (elementBodyMap.has(element)) return;

        const rect = element.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const x = rect.left + width / 2;
        const y = rect.top + height / 2;

        const body = Bodies.rectangle(x, y, width, height, {
            restitution: 0.5,
            friction: 0.8
        });

        elementBodyMap.set(element, body);
        World.add(world, body);
    }

    let brokenness = 0;

    function corruptElementsAbove() {
        const threshold = 100;
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.bottom < threshold) {
                corruptElement(element);

            }
        });
    }


    document.addEventListener('scroll', function () {
        corruptElementsAbove();
    });

    document.addEventListener('click', function (event) {
        console.log('Element clicked:', event.target);

        if (event.target.tagName.toLowerCase() === 'a') {
            event.preventDefault();
        }

        let element = event.target;
        brokenness++;
        if (element.clientHeight < window.innerHeight * 0.8) {
            fallElement(element);
        } else {
            console.log('Element is too tall to fall');
        }

        crackScreen(event.pageX, event.pageY - window.scrollY);
        if (brokenness > 20) {
            showBSOD();
        }
    });

    function corruptElement(element) {
        if (corruptedElements.has(element)) return;

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
            default:
                //fallElement(element);
                break;
        }
        corruptedElements.add(element);
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
        message.textContent = 'You should take a break.';
        bsod.appendChild(message);

        document.body.appendChild(bsod);
    }
}

initializeMatterJS();