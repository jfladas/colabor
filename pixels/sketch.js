let pixelSize
let pixels = []
let rows, cols
let mode

let height = 1
let speed = 10

let y = 0
let step

let video
let vidPixels = []

function setup() {
    let side = windowWidth < windowHeight ? windowWidth : windowHeight
    //let canvas = createCanvas(side, side)
    let canvas = createCanvas(windowWidth, windowHeight)
    //canvas.position((windowWidth - side) / 2, (windowHeight - side) / 2)
    canvas.position(0, 0)
    background(200)
    noStroke()
    frameRate(10)

    pixelSize = floor(side / 150)

    //rows = ceil(side / pixelSize)
    //cols = ceil(side / pixelSize)
    rows = ceil(windowHeight / pixelSize)
    cols = ceil(windowWidth / pixelSize)

    mode = 'horizontal'
    step = 0.51

    pixels = Array.from({ length: rows }, () => Array(cols).fill(0))
    vidPixels = Array.from({ length: rows }, () => Array(cols).fill(0))

    //obstructRect(20, 200, 200, 250)
    //invertRect(50, 50, 100, 220)

    //addRandomRects()

    //obstructCircle(50, 80, 150)
    //invertCircle(20, 60, 200)
    //resetCircle(20, 100, 100)

    //raisedCircle(50, ceil(cols / 2), ceil(rows / 2))

    video = createCapture(VIDEO)
    video.size(cols, rows)
    video.hide()
}

function draw() {

    drawPixels()
    resetPixels()

    /* 
        // Button
        if (height < 100 && height > 0) {
            frameRate(10)
            height += speed
            if (height > 100) {
                height = 100
            }
            if (height < 0) {
                height = 0
            }
        } else {
            frameRate(1)
            if (speed > 0) {
                height = 91
            } else {
                height = 9
            }
            speed = -speed
        }
        raisedCircle(60, ceil(cols / 2), ceil(rows / 2), height / 100)
     */

    /* 
        // Simple Moire (disable reset)
        step = 2
        y += step
        invertCircle(100 * (y / 500), ceil(cols / 2), y - 100)
        if (mouseIsPressed) {
            frameRate(1)
        } else {
            frameRate(10)
        }
     */


    // Moire
    //moireCircle(50, ceil(cols / 2), ceil(rows / 2), step, 'top')
    //moireCircle(50, ceil(cols / 2), ceil(rows / 2), step, 'bottom')
    //moireCircle(50, ceil(cols / 2), ceil(rows / 2), step, 'left')
    //moireCircle(50, ceil(cols / 2), ceil(rows / 2), step, 'right')

    moireCircleMasked(60, ceil(cols / 2), ceil(rows / 2), step, 'top')
    moireCircleMasked(60, ceil(cols / 2), ceil(rows / 2), step, 'left')
    step += 0.005

    obstructVideo()

    displayStep()
    displayFps()


    if (keyIsPressed && key === ' ') {
        noLoop();
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

function displayStep() {
    textSize(32);
    textAlign(RIGHT, TOP);
    textFont('Courier New');
    textStyle(BOLD);
    fill(255);
    text(`${step.toFixed(2)}`, width - 12, 10);
    text(`${step.toFixed(2)}`, width - 8, 10);
    fill(0);
    text(`${step.toFixed(2)}`, width - 10, 10);
}

function displayFps() {
    textSize(32);
    textAlign(LEFT, TOP);
    textFont('Courier New');
    textStyle(BOLD);
    fill(255);
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
            if (pixels[j][i] == 0) {
                pixels[j][i] = 1
            } else {
                pixels[j][i] = 0
            }
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
                if (pixels[j][i] == 0) {
                    pixels[j][i] = 1
                } else {
                    pixels[j][i] = 0
                }
            }
        }
    }
}

function invertCircleMasked(radius, x, y, maskRadius, maskX, maskY) {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (distSq(i, j, x, y) < radius ** 2) {
                if (distSq(i, j, maskX, maskY) < maskRadius ** 2) {
                    if (pixels[j][i] == 0) {
                        pixels[j][i] = 1
                    } else {
                        pixels[j][i] = 0
                    }
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
        }
    }
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
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