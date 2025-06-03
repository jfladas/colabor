if (localStorage.getItem('qr8') !== 'done') {
    localStorage.setItem('qr8', 'found');
}
let pixelSize
let pixels = []
let rows, cols
let mode

let shown = false

let ripples = [
    {
        x: 100,
        y: 100,
        radius: 0,
        active: true
    }
]
let rippleSpeed = 2
let rippleMax

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
        ripples = [
            {
                x: floor(windowWidth / pixelSize / 2),
                y: floor(windowHeight / pixelSize / 2),
                radius: 0,
                active: true
            }
        ];
    }

    rows = ceil(windowHeight / pixelSize)
    cols = ceil(windowWidth / pixelSize)

    mode = 'white'

    pixels = Array.from({ length: rows }, () => Array(cols).fill(0))

    resetPixels()

    rippleMax = max(rows, cols) * 1.2

    setTimeout(() => {
        if (!shown) {
            document.getElementById('msg').style.opacity = 1;
            shown = true;
        }
    }, 3000);
}

function windowResized() {
    setup()
}

function draw() {

    drawPixels()
    resetPixels()

    for (let ripple of ripples) {
        if (ripple.active) {
            ripple.radius += rippleSpeed;
            if (ripple.radius > rippleMax) {
                ripple.active = false;
                if (mode == 'black') {
                    mode = 'white';
                } else {
                    mode = 'black';
                }
            }
            invertCircle(ripple.radius, ripple.x, ripple.y);

        }
    }
}

function mousePressed() {
    localStorage.setItem('qr8', 'done')
    document.getElementById('msg').style.opacity = 0;
    shown = true;
    ripples.push({
        x: floor(mouseX / pixelSize),
        y: floor(mouseY / pixelSize),
        radius: 0,
        active: true
    });
}

function touchStarted() {
    localStorage.setItem('qr8', 'done')
    document.getElementById('msg').style.opacity = 0;
    shown = true;
    ripples.push({
        x: floor(mouseX / pixelSize),
        y: floor(mouseY / pixelSize),
        radius: 0,
        active: true
    });
    return false;
}

function touchMoved() {
    ripples.push({
        x: floor(mouseX / pixelSize),
        y: floor(mouseY / pixelSize),
        radius: 0,
        active: true
    });
    return false;
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
    switch (mode) {
        default:
        case 'white':
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    pixels[i][j] = 0
                }
            }
            break
        case 'black':
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    pixels[i][j] = 1
                }
            }
            break
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
function distSq(x1, y1, x2, y2) {
    return (x1 - x2) ** 2 + (y1 - y2) ** 2;
}