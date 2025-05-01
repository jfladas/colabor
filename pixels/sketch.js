let pixelSize = 3
let pixels = []
let rows, cols
let mode

let height = 1
let speed = 10

let y = 0
let step

function setup() {
    //let canvas = createCanvas(windowWidth, windowWidth)
    let canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    background(200)
    noStroke()
    frameRate(60)

    //rows = ceil(windowWidth / pixelSize)
    rows = ceil(windowHeight / pixelSize)
    cols = ceil(windowWidth / pixelSize)

    mode = 'checkered'
    step = 0.6

    resetPixels()

    //obstructRect(20, 200, 200, 250)
    //invertRect(50, 50, 100, 220)

    //addRandomRects()

    //obstructCircle(50, 80, 150)
    //invertCircle(20, 60, 200)
    //resetCircle(20, 100, 100)

    //raisedCircle(50, ceil(cols / 2), ceil(rows / 2))
}

function draw() {

    //addRandomRects()

    /*
    drawPixels()
    resetPixels()
    if (height < 100 && height > 0) {
        frameRate(60)
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
    step = 2
    y += step
    invertCircle(100 * (y / 500), ceil(cols / 2), y - 100)
    if (mouseIsPressed) {
        frameRate(1)
    } else {
        frameRate(60)
    }
    */

    resetPixels()

    //moireCircle(50, ceil(cols / 2), ceil(rows / 2), step, 'top')
    //moireCircle(50, ceil(cols / 2), ceil(rows / 2), step, 'bottom')
    //moireCircle(50, ceil(cols / 2), ceil(rows / 2), step, 'left')
    //moireCircle(50, ceil(cols / 2), ceil(rows / 2), step, 'right')

    moireCircleMasked(50, ceil(cols / 2), ceil(rows / 2), step, 'top')
    moireCircleMasked(50, ceil(cols / 2), ceil(rows / 2), step, 'left')
    step += 0.01

    drawPixels()
    displayStep()
}

function drawPixels() {
    clear()
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (pixels[j][i] == 0) {
                fill(255)
            } else {
                fill(0)
            }
            square(i * pixelSize, j * pixelSize, pixelSize)
        }
    }
}

function resetPixels() {
    switch (mode) {
        default:
        case 'horizontal':
            for (let i = 0; i < rows; i++) {
                pixels[i] = []
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
                pixels[i] = []
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
                pixels[i] = []
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
                pixels[i] = []
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
        case 'blank':
            for (let i = 0; i < rows; i++) {
                pixels[i] = []
                for (let j = 0; j < cols; j++) {
                    pixels[i][j] = 0
                }
            }
            break
    }
}

function displayStep() {
    fill(0);
    textSize(32);
    textAlign(RIGHT, TOP);
    textFont('Courier New');
    textStyle(BOLD);
    text(`${step.toFixed(2)}`, width - 10, 10);
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
            if (dist(i, j, x, y) < radius) {
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
            if (dist(i, j, x, y) < radius) {
                if (dist(i, j, maskX, maskY) < maskRadius) {
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
                if (floor(dist(i, j, x, y)) <= radius) {
                    pixels[j][i] = pixels[j][i - 1]
                }
            }
        }
    } else {
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (floor(dist(i, j, x, y)) <= radius) {
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
                    if (dist(i, j, x, y) < radius) {
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
                    if (dist(i, j, x, y) < radius) {
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
                    if (dist(i, j, x, y) < radius) {
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
    resetCircle(radius, x, y - ceil(radius / 5 * height))
    let static = 0
    if (height == 1) {
        static = 1
    }
    if (height != 0) {
        invertCircle(radius, x, y - ceil(radius / 5 * height) - static)
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