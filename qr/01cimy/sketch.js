let pixelSize
let pixels = []
let rows, cols
let mode

let y = 0
let step, dir = 1

let mic, amplitude, micLevel = 0;
let micStarted = false;
let micPromptTimer = 0;
let micPromptShown = false;

function setup() {
    let side = min(windowWidth, windowHeight)
    let canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    background(200)
    noStroke()
    frameRate(10)

    pixelSize = floor(side / 150)

    rows = ceil(windowHeight / pixelSize)
    cols = ceil(windowWidth / pixelSize)

    mode = 'black'
    step = 0.51

    pixels = Array.from({ length: rows }, () => Array(cols).fill(0))

    resetPixels()

    mic = new p5.AudioIn();
    amplitude = new p5.Amplitude();
    micPromptTimer = millis();
    micPromptShown = false;
}

function mousePressed() {
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }
    if (!micStarted) {
        mic.start(() => {
            amplitude.setInput(mic);
            micStarted = true;
            micPromptShown = false;
            document.getElementById('msg').style.opacity = 0;
            localStorage.setItem('qr1', 'done');
        });
    }
}

function draw() {
    let radius;
    if (micStarted) {
        micLevel = amplitude.getLevel();
        let minRadius = 20;
        let maxRadius = 120;
        radius = map(micLevel, 0, 0.2, minRadius, maxRadius);
        radius = constrain(radius, minRadius, maxRadius);
    } else {
        radius = 60;
        if (!micPromptShown && millis() - micPromptTimer > 3000) {
            micPromptShown = true;
        }
    }

    drawPixels()
    resetPixels()

    moireCircleMasked(radius, ceil(cols / 2), ceil(rows / 2), step, 'top')
    moireCircleMasked(radius, ceil(cols / 2), ceil(rows / 2), step, 'left')
    if (step >= 3 || step <= 0.5) {
        dir = -dir
    }
    step += 0.005 * dir;

    if (micPromptShown && !micStarted) {
        document.getElementById('msg').style.opacity = 1;
    }
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
        case 'horizontal':
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    if (i % 2 == 0) {
                        pixels[i][j] = 0
                    } else {
                        pixels[i][j] = 1
                    }
                }
            }
            break
        case 'vertical':
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    if (j % 2 == 0) {
                        pixels[i][j] = 0
                    } else {
                        pixels[i][j] = 1
                    }
                }
            }
            break
        case 'checkered':
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    if ((i + j) % 2 == 0) {
                        pixels[i][j] = 0
                    } else {
                        pixels[i][j] = 1
                    }
                }
            }
            break
        case 'rectangle':
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    if (
                        (i > j && rows - i > j && j < (cols / 2)) ||
                        (i > (cols - j) && rows - i > (cols - j) && j >= (cols / 2))
                    ) {
                        if (j % 2 == 0) {
                            pixels[i][j] = 0
                        } else {
                            pixels[i][j] = 1
                        }
                    }
                    else {
                        if (i % 2 == 0) {
                            pixels[i][j] = 0
                        } else {
                            pixels[i][j] = 1
                        }
                    }
                }
            }
            break
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