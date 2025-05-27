let pixelSize
let pixels = []
let rows, cols
let mode

let video
let vidPixels = []

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

    mode = 'checkered'

    pixels = Array.from({ length: rows }, () => Array(cols).fill(0))
    vidPixels = Array.from({ length: rows }, () => Array(cols).fill(0))

    resetPixels()

    let constraints = {
        video: {
            facingMode: { exact: "environment" }
        }
    };
    video = createCapture(constraints, function (stream) {
        if (!stream) {
            video = createCapture(VIDEO);
        }
        video.size(cols, rows)
        video.hide()
    });
    video.on('error', () => {
        video = createCapture(VIDEO);
        video.size(cols, rows)
        video.hide()
    });
}

function draw() {

    drawPixels()
    resetPixels()

    obstructVideo()
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

function obstructVideo() {
    video.loadPixels();
    if (video.elt.readyState !== 4) {
        return;
    }
    localStorage.setItem('qr2', 'done');
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let index = (j * video.width + i) * 4
            let brightness = (video.pixels[index] + video.pixels[index + 1] + video.pixels[index + 2]) / 3
            vidPixels[j][cols - i - 1] = brightness > 100 ? 0 : 1

            if (vidPixels[j][i] == 1) {
                if (mode == 'vertical' && i > 0) {
                    pixels[j][i] = pixels[j][i - 1]
                } else if (mode != 'vertical' && j > 0) {
                    pixels[j][i] = pixels[j - 1][i]
                } else {
                    pixels[j][i] = 1
                }
            }
        }
    }
}