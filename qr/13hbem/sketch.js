if (localStorage.getItem('qr13') !== 'done') {
    localStorage.setItem('qr13', 'found');
}

let pixelSize
let pixels = []
let lifePixels = []
let lifeAges = []
let rows, cols
let mode

let shown = false

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    background(255)
    noStroke()
    frameRate(10)

    pixelSize = floor(windowHeight / 150)

    mode = 'rectangle'

    rows = ceil(windowHeight / pixelSize)
    cols = ceil(windowWidth / pixelSize)

    pixels = Array.from({ length: rows }, () => Array(cols).fill(0))
    lifePixels = Array.from({ length: rows }, () => Array(cols).fill(0))
    lifeAges = Array.from({ length: rows }, () => Array(cols).fill(0))

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
    lifeStep()
    if (touches.length > 0) {
        for (const t of touches) {
            createLife(t.x, t.y);
        }
    } else if (mouseIsPressed) {
        createLife(mouseX, mouseY);
    }
}

function lifeStep() {
    let nextLifePixels = Array.from({ length: rows }, () => Array(cols).fill(0));
    let nextLifeAges = Array.from({ length: rows }, () => Array(cols).fill(0));
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let neighbors = 0;
            for (let di = -1; di <= 1; di++) {
                for (let dj = -1; dj <= 1; dj++) {
                    if (di === 0 && dj === 0) continue;
                    let ni = i + di;
                    let nj = j + dj;
                    if (ni >= 0 && ni < rows && nj >= 0 && nj < cols) {
                        neighbors += lifePixels[ni][nj];
                    }
                }
            }
            if (lifePixels[i][j] === 1) {
                if (neighbors < 2 || neighbors > 3) {
                    nextLifePixels[i][j] = 0; // dies
                }
                else {
                    nextLifePixels[i][j] = 1; // survives
                }
            } else {
                if (neighbors === 3) {
                    nextLifePixels[i][j] = 1; // becomes alive
                } else {
                    nextLifePixels[i][j] = 0; // remains dead
                }
            }

            if (nextLifePixels[i][j] === 1) {
                nextLifeAges[i][j] = lifeAges[i][j] + 1;
            } else {
                nextLifeAges[i][j] = 0;
            }

            if (nextLifeAges[i][j] >= 3) {
                nextLifePixels[i][j] = 0;
                nextLifeAges[i][j] = 0;
            }
        }
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            lifePixels[i][j] = nextLifePixels[i][j];
            lifeAges[i][j] = nextLifeAges[i][j];
            if (lifePixels[i][j] == 1) {
                pixels[i][j] = 1 - pixels[i][j];
            }
        }
    }
}

function createLife(x, y) {
    document.getElementById('msg').style.opacity = 0;
    localStorage.setItem('qr13', 'done');
    shown = true;
    let i = floor(y / pixelSize)
    let j = floor(x / pixelSize)
    let size = 5
    if (i > 0 && i < rows - 1 && j > 0 && j < cols - 1) {
        lifePixels[i][j] = 1
        lifeAges[i][j] = 0
        for (let di = -size; di <= size; di++) {
            for (let dj = -size; dj <= size; dj++) {
                if (di === 0 && dj === 0) continue
                let ni = i + di;
                let nj = j + dj;
                if (ni >= 0 && ni < rows && nj >= 0 && nj < cols) {
                    if (random() < 0.5) {
                        lifePixels[ni][nj] = 1
                        lifeAges[ni][nj] = 0
                    }
                }
            }
        }
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