if (localStorage.getItem('qr11') !== 'done') {
    localStorage.setItem('qr11', 'found');
}
let pixelSize
let pixels = []
let rows, cols
let mode

let shown = false

let inputText = ''
let textX = 0, textY
let textGfx

let moveSpeed = 10

const fontMap = {
    'default': 'Roboto Flex',
    'bold': 'Archivo Black',
    'serif': 'Times New Roman',
    'mono': 'JetBrains Mono',
    'script': 'Imperial Script'
};
let font = fontMap['default'];

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    background(255)
    noStroke()

    pixelSize = floor(windowHeight / 150)

    rows = ceil(windowHeight / pixelSize)
    cols = ceil(windowWidth / pixelSize)

    pixels = Array.from({ length: rows }, () => Array(cols).fill(0))

    inputText = document.querySelector('input[id="text-input"]').value || 'type something...';
    textX = width

    document.querySelector('input[id="text-input"]')?.addEventListener('input', () => {
        localStorage.setItem('qr11', 'done');
        inputText = document.querySelector('input[id="text-input"]').value
    })
    document.querySelector('input[id="speed"]')?.addEventListener('input', e => {
        moveSpeed = Number(e.target.value)
    })
    textGfx = createGraphics(windowWidth, windowHeight)
    textGfx.pixelDensity(1)
    textGfx.textAlign(LEFT, CENTER)
    textGfx.textFont(font)
    textGfx.textSize(windowHeight / 3)
    textGfx.fill(0)
    textGfx.noStroke()
    document.querySelector('#font-select')?.addEventListener('change', e => {
        const v = e.target.value;
        font = fontMap[v];
        textGfx.textFont(font);
        if (v === 'script') {
            textGfx.textSize(windowHeight / 2);
        } else {
            textGfx.textSize(windowHeight / 3);
        }
    });
}

function windowResized() {
    setup()
}

function draw() {
    textX -= moveSpeed
    if (textX < -textGfx.textWidth(inputText) - 100) {
        textX = width
    }
    if (document.getElementById('params')?.classList.contains('expanded')) {
        textY = textGfx.height / 2
    } else {
        textY = textGfx.height / 3
    }

    textGfx.background(255)
    textGfx.textFont(font)
    textGfx.text(inputText, textX, textY)

    textGfx.loadPixels()
    let w = textGfx.width
    let h = textGfx.height

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let x = Math.floor(j * pixelSize + pixelSize / 2)
            let y = Math.floor(i * pixelSize + pixelSize / 2)
            if (x < 0 || x >= w || y < 0 || y >= h) {
                pixels[i][j] = 1
                continue
            }
            let idx = 4 * (x + y * w)
            let r = textGfx.pixels[idx]
            let g = textGfx.pixels[idx + 1]
            let b = textGfx.pixels[idx + 2]
            let a = textGfx.pixels[idx + 3]
            let bright = (r + g + b) / 3
            pixels[i][j] = (a > 0 && bright < 128) ? 0 : 1
        }
    }

    background(255)
    drawPixels()
}

function drawPixels() {
    clear()
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (pixels[i][j]) {
                fill(0)
            } else {
                fill(255)
            }
            rect(j * pixelSize, i * pixelSize, pixelSize, pixelSize)
        }
    }
}