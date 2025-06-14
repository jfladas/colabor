if (localStorage.getItem('qr1') !== 'done') {
    localStorage.setItem('qr1', 'found');
}
let pixelSize
let pixels = []
let rows, cols

let y = 0
let step, dir = 1

let mic, amplitude, micLevel = 0;
let micStarted = false;

let displayRadius = 60;

const iframe = window.self !== window.top;
function setup() {
    let side = min(windowWidth, windowHeight)
    let canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    background(255)
    noStroke()
    frameRate(10)

    pixelSize = floor(side / 150)
    if (iframe) {
        pixelSize = 5;
    }

    rows = ceil(windowHeight / pixelSize)
    cols = ceil(windowWidth / pixelSize)

    step = 0.51

    pixels = Array.from({ length: rows }, () => Array(cols).fill(0))

    resetPixels()

    mic = new p5.AudioIn();
    amplitude = new p5.Amplitude();
    micPromptTimer = millis();

    setTimeout(() => {
        if (!micStarted) {
            document.getElementById('msg').style.opacity = 1;
        }
    }, 3000);

    canvas.mousePressed(startMic);
}

function windowResized() {
    setup()
}

function startMic() {
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }
    if (!micStarted) {
        mic.start(() => {
            amplitude.setInput(mic);
            micStarted = true;
            document.getElementById('msg').style.opacity = 0;
            localStorage.setItem('qr1', 'done');
        });
    }
}

function draw() {
    let targetRadius;
    if (micStarted) {
        micLevel = amplitude.getLevel();
        let minRadius = 20;
        let maxRadius = 120;
        if (iframe) {
            minRadius = 1;
            maxRadius = 10;
        }
        if (pixelSize < 5) {
            targetRadius = map(micLevel, 0, 0.1, minRadius, maxRadius);
        } else {
            targetRadius = map(micLevel, 0, 0.2, minRadius, maxRadius);
        }
        targetRadius = constrain(targetRadius, minRadius, maxRadius);
    } else {
        targetRadius = 60;
        if (iframe) {
            targetRadius = 10;
        }
    }

    displayRadius = lerp(displayRadius, targetRadius, 0.5);

    drawPixels()
    resetPixels()

    moireCircleMasked(displayRadius, ceil(cols / 2), ceil(rows / 2), step, 'top')
    moireCircleMasked(displayRadius, ceil(cols / 2), ceil(rows / 2), step, 'left')
    if (step >= 3 || step <= 0.5) {
        dir = -dir
    }
    step += 0.005 * dir;
}

function drawPixels() {
    clear()
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (pixels[j][i] != 0) {
                fill(0)
                square(i * pixelSize, j * pixelSize, pixelSize)
            }
        }
    }
}

function resetPixels() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            pixels[i][j] = 1
        }
    }
}

function invertCircle(radius, x, y) {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (distSq(i, j, x, y) < radius ** 2) {
                pixels[j][i] = 1 - pixels[j][i];
            }
        }
    }
}

function invertCircleMasked(radius, x, y, maskRadius, maskX, maskY) {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (distSq(i, j, maskX, maskY) < maskRadius ** 2) {
                if (distSq(i, j, x, y) < radius ** 2) {
                    pixels[j][i] = 1 - pixels[j][i];
                }
            }
        }
    }
}

function moireCircleMasked(radius, x, y, s, dir = 'top') {
    let offset = 2 * radius
    switch (dir) {
        default:
        case 'top':
            for (let i = 0; i < offset; i += s) {
                invertCircleMasked(radius, x, -offset + y + i, radius, x, y)
            }
            break
        case 'bottom':
            for (let i = 0; i < offset; i += s) {
                invertCircleMasked(radius, x, offset + y - i, radius, x, y)
            }
            break
        case 'left':
            for (let i = 0; i < offset; i += s) {
                invertCircleMasked(radius, -offset + x + i, y, radius, x, y)
            }
            break
        case 'right':
            for (let i = 0; i < offset; i += s) {
                invertCircleMasked(radius, offset + x - i, y, radius, x, y)
            }
            break
    }
    if (floor(offset / s) % 2 == 0) {
        invertCircle(radius, x, y)

    }
}

function distSq(x1, y1, x2, y2) {
    return (x1 - x2) ** 2 + (y1 - y2) ** 2;
}