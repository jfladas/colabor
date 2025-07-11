if (localStorage.getItem('qr15') !== 'done') {
    localStorage.setItem('qr15', 'found');
}

let pixelSize
let pixels = []
let rows, cols
let mode

let height = 0.01
let speed = 0.1

let y = 0
let step, dir = 1

let shown = false

const iframe = window.self !== window.top;
if (iframe) {
    const style = document.createElement('style');
    style.innerHTML = `
        html::-webkit-scrollbar {
            display: none;
        }
        html {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    `;
    document.head.appendChild(style);
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight)
    background(255)
    noStroke()
    frameRate(10)

    pixelSize = floor(windowHeight / 150)
    if (iframe) {
        pixelSize = 5;

    }

    rows = ceil(windowHeight / pixelSize)
    cols = ceil(windowWidth / pixelSize)

    mode = 'horizontal'
    step = 0.51

    pixels = Array.from({ length: rows }, () => Array(cols).fill(0))

    resetPixels()

    setTimeout(() => {
        if (!shown) {
            document.getElementById('msg').style.opacity = 1;
            shown = true;
        }
    }, 3000);
    window.addEventListener('scroll', () => {
        localStorage.setItem('qr15', 'done');
        shown = true;
        document.getElementById('msg').style.opacity = 0;
    });
}

function windowResized() {
    setup()
}

function draw() {

    drawPixels()
    resetPixels()

    step = map(window.scrollY, 0, document.body.scrollHeight - window.innerHeight, 0.3, 2);

    moireCircleMasked(max(rows, cols), ceil(cols / 2), ceil(rows / 2), step, 'top')
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