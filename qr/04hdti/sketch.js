let pixelSize
let pixels = []
let rows, cols
let mode

let pen

function setup() {
    let side = min(windowWidth, windowHeight)
    let canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    background(200)
    noStroke()

    pixelSize = floor(side / 150)

    rows = ceil(windowHeight / pixelSize)
    cols = ceil(windowWidth / pixelSize)

    mode = 'horizontal'
    pen = 'moire'

    pixels = Array.from({ length: rows }, () => Array(cols).fill(0))

    resetPixels()

    const patternRadios = document.querySelectorAll('input[name="pattern"]')
    patternRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            getParams()
            resetPixels()
        })
    })
}

function draw() {

    drawPixels()

    getParams()

    if (mouseIsPressed) {
        localStorage.setItem('qr4', 'done')
        switch (pen) {
            case 'black':
                drawCircle(brushRadius, mouseX / pixelSize, mouseY / pixelSize, 1)
                break
            case 'white':
                drawCircle(brushRadius, mouseX / pixelSize, mouseY / pixelSize, 0)
                break
            case 'obstruct':
                obstructCircle(brushRadius, mouseX / pixelSize, mouseY / pixelSize)
                break
            case 'invert':
                invertCircle(brushRadius, mouseX / pixelSize, mouseY / pixelSize)
                break
            case 'reset':
                resetCircle(brushRadius, mouseX / pixelSize, mouseY / pixelSize)
                break
        }
    }
}

function getParams() {
    if (document.getElementById('pen-black')?.checked) {
        pen = 'black'
    } else if (document.getElementById('pen-white')?.checked) {
        pen = 'white'
    } else if (document.getElementById('pen-obstruct')?.checked) {
        pen = 'obstruct'
    } else if (document.getElementById('pen-invert')?.checked) {
        pen = 'invert'
    } else if (document.getElementById('pen-reset')?.checked) {
        pen = 'reset'
    }

    if (document.getElementById('horizontal')?.checked) {
        mode = 'horizontal'
    } else if (document.getElementById('vertical')?.checked) {
        mode = 'vertical'
    } else if (document.getElementById('checkered')?.checked) {
        mode = 'checkered'
    } else if (document.getElementById('black')?.checked) {
        mode = 'black'
    } else if (document.getElementById('white')?.checked) {
        mode = 'white'
    }

    let widthInput = document.getElementById('width')
    if (widthInput) {
        brushRadius = parseInt(widthInput.value, 10)
    } else {
        brushRadius = 5
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

function drawCircle(radius, x, y, color) {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (distSq(i, j, x, y) < radius ** 2) {
                pixels[j][i] = color
            }
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


function distSq(x1, y1, x2, y2) {
    return (x1 - x2) ** 2 + (y1 - y2) ** 2;
}