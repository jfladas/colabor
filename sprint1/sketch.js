let pixelSize
let pixels = []
let rows, cols
let mode

let height = 0.01
let speed = 0.1

let y = 0
let step, dir = 1

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    canvas.style('z-index', '-5')
    canvas.style('position', 'fixed')
    noStroke()
    fill(0)
    frameRate(10)

    pixelSize = floor(min(windowWidth, windowHeight) / 50)
    rows = ceil(windowHeight / pixelSize)
    cols = ceil(windowWidth / pixelSize)

    mode = 'black'
    step = 0.51

    pixels = Array.from({ length: rows }, () => Array(cols).fill(0))

    resetPixels()
}

function draw() {

    drawPixels()
    resetPixels()
    /* 
        moireCircleMasked(30, ceil(cols / 2), ceil(rows / 2), step, 'top')
        moireCircleMasked(30, ceil(cols / 2), ceil(rows / 2), step, 'left')
     */
    moireCircleMasked(max(cols, rows), ceil(cols / 2), ceil(rows / 2), step, 'top')
    moireCircleMasked(max(cols, rows), ceil(cols / 2), ceil(rows / 2), step, 'left')

    if (step >= 3 || step <= 0.5) {
        dir = -dir
    }
    step += 0.005 * dir;
}

function windowResized() {
    setup();
}

function drawPixels() {
    clear()
    background(60, 60, 70)
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (pixels[j][i] != 0) {
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

function displayStep() {
    textSize(32);
    textAlign(RIGHT, TOP);
    textFont('monospace');
    textStyle(BOLD);
    fill(20);
    text(`${step.toFixed(2)}`, width - 12, 10);
    text(`${step.toFixed(2)}`, width - 8, 10);
    fill(0);
    text(`${step.toFixed(2)}`, width - 10, 10);
}

function displayFps() {
    textSize(32);
    textAlign(LEFT, TOP);
    textFont('monospace');
    textStyle(BOLD);
    fill(20);
    text(`FPS: ${frameRate().toFixed(2)} `, 8, 10);
    text(`FPS: ${frameRate().toFixed(2)} `, 12, 10);
    fill(0);
    text(`FPS: ${frameRate().toFixed(2)} `, 10, 10);
}

function addRandomRects() {
    invertRect(
        floor(random(0, cols)),
        floor(random(0, rows)),
        floor(random(0, cols)),
        floor(random(0, rows))
    )
    obstructRect(
        floor(random(0, cols)),
        floor(random(0, rows)),
        floor(random(0, cols)),
        floor(random(0, rows))
    )
    invertRect(
        floor(random(0, cols)),
        floor(random(0, rows)),
        floor(random(0, cols)),
        floor(random(0, rows))
    )
    obstructRect(
        floor(random(0, cols)),
        floor(random(0, rows)),
        floor(random(0, cols)),
        floor(random(0, rows))
    )
    invertRect(
        floor(random(0, cols)),
        floor(random(0, rows)),
        floor(random(0, cols)),
        floor(random(0, rows))
    )
}

function invertRect(startX, startY, endX, endY) {
    if (startX > endX) {
        let temp = startX
        startX = endX
        endX = temp
    }
    if (startY > endY) {
        let temp = startY
        startY = endY
        endY = temp
    }
    if (endX > cols) {
        endX = cols
    }
    if (endY > rows) {
        endY = rows
    }
    for (let i = startX; i < endX; i++) {
        for (let j = startY; j < endY; j++) {
            pixels[j][i] = 1 - pixels[j][i];
        }
    }
}

function obstructRect(startX, startY, endX, endY) {
    if (startX > endX) {
        let temp = startX
        startX = endX
        endX = temp
    }
    if (startY > endY) {
        let temp = startY
        startY = endY
        endY = temp
    }
    if (endX > cols) {
        endX = cols
    }
    if (endY > rows) {
        endY = rows
    }
    let length = random(5, 20)
    let counter = 0
    let value = 0
    for (let i = startX; i < endX; i++) {
        if (counter >= length) {
            if (value == 0) {
                value = 1
            }
            else {
                value = 0
            }
            counter = 0
            length = random(5, 20)
        }
        counter++
        for (let j = startY; j < endY; j++) {
            pixels[j][i] = value
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

function obstructCircle(radius, x, y) {
    if (mode == 'vertical') {
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (distSq(i, j, x, y) <= radius ** 2) {
                    pixels[j][i] = pixels[j][i - 1]
                }
            }
        }
    } else {
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (distSq(i, j, x, y) <= radius ** 2) {
                    pixels[j][i] = pixels[j - 1][i]
                }
            }
        }
    }
}

function resetCircle(radius, x, y) {
    switch (mode) {
        default:
        case 'horizontal':
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    if (distSq(i, j, x, y) < radius ** 2) {
                        if (j % 2 == 0) {
                            pixels[j][i] = 0
                        } else {
                            pixels[j][i] = 1
                        }
                    }
                }
            }
            break
        case 'vertical':
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    if (distSq(i, j, x, y) < radius ** 2) {
                        if (i % 2 == 0) {
                            pixels[j][i] = 0
                        } else {
                            pixels[j][i] = 1
                        }
                    }
                }
            }
            break
        case 'checkered':
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    if (distSq(i, j, x, y) < radius ** 2) {
                        if ((i + j) % 2 == 0) {
                            pixels[j][i] = 0
                        } else {
                            pixels[j][i] = 1
                        }
                    }
                }
            }
            break
        case 'white':
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    if (distSq(i, j, x, y) < radius ** 2) {
                        pixels[j][i] = 0
                    }
                }
            }
            break
        case 'black':
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    if (distSq(i, j, x, y) < radius ** 2) {
                        pixels[j][i] = 1
                    }
                }
            }
            break
    }
}

function raisedCircle(radius, x, y, height = 1) {
    obstructCircle(radius, x, y)
    resetCircle(radius, x, y - ceil(radius / 3 * height))
    if (height != 0) {
        invertCircle(radius, x, y - ceil(radius / 3 * height))
    } else {
        resetCircle(radius + 1, x, y)
    }
}

function moireCircle(radius, x, y, s, dir = 'top') {
    let offset = rows
    if (rows < cols) {
        offset = cols
    }
    switch (dir) {
        default:
        case 'top':
            for (let i = 0; i < offset; i += s) {
                invertCircle(radius, x, -offset + y + i)
            }
            break
        case 'bottom':
            for (let i = 0; i < offset; i += s) {
                invertCircle(radius, x, offset + y - i)
            }
            break
        case 'left':
            for (let i = 0; i < offset; i += s) {
                invertCircle(radius, -offset + x + i, y)
            }
            break
        case 'right':
            for (let i = 0; i < offset; i += s) {
                invertCircle(radius, offset + x - i, y)
            }
            break
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

function obstructVideo() {
    video.loadPixels();
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