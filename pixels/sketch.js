let pixelSize = 3
let pixels = []
let rows, cols

let height = 1
let speed = 10

let y = 0
let step = 1

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    background(200)
    noStroke()
    frameRate(60)

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
    for (let i = 0; i < pixels[0].length; i++) {
        for (let j = 0; j < pixels.length; j++) {
            if (pixels[j][i] == 0) {
                fill(255)
            } else {
                fill(0)
            }
            square(i * pixelSize, j * pixelSize, pixelSize)
        }
    }

    //addRandomRects()

    /*
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

    y += step
    invertCircle(100 * (y / 500), ceil(cols / 2), y - 100)
    if (mouseIsPressed) {
        frameRate(1)
    } else {
        frameRate(60)
    }
}

function resetPixels() {
    rows = ceil(windowHeight / pixelSize)
    cols = ceil(windowWidth / pixelSize)

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
    if (endX > pixels[0].length) {
        endX = pixels[0].length
    }
    if (endY > pixels.length) {
        endY = pixels.length
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
    if (endX > pixels[0].length) {
        endX = pixels[0].length
    }
    if (endY > pixels.length) {
        endY = pixels.length
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
    for (let i = 0; i < pixels[0].length; i++) {
        for (let j = 0; j < pixels.length; j++) {
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

function obstructCircle(radius, x, y) {
    for (let i = 0; i < pixels[0].length; i++) {
        for (let j = 0; j < pixels.length; j++) {
            if (floor(dist(i, j, x, y)) <= radius) {
                pixels[j][i] = pixels[j - 1][i]
            }
        }
    }

}

function resetCircle(radius, x, y) {
    for (let i = 0; i < pixels[0].length; i++) {
        for (let j = 0; j < pixels.length; j++) {
            if (dist(i, j, x, y) < radius) {
                if (j % 2 == 0) {
                    pixels[j][i] = 0
                } else {
                    pixels[j][i] = 1
                }
            }
        }
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