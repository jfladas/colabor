let pixelSize = 3
let pixels = []
let rows, cols

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    background(200)
    noStroke()

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

    //obstructRect(20, 200, 200, 250)
    //invertRect(50, 50, 100, 220)

    addRandomRects()
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