if (localStorage.getItem('qr10') !== 'done') {
    localStorage.setItem('qr10', 'found');
}
let pixelSize
let pixels = []
let rows, cols
let mode

let shown = false

let countdownSeconds = 10 * 60;
let lastSecond = 0;
let timerEnded = false;

function setup() {
    let side = min(windowWidth, windowHeight)
    let canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    background(255)
    noStroke()
    frameRate(10)

    pixelSize = floor(side / 50)

    rows = ceil(windowHeight / pixelSize)
    cols = ceil(windowWidth / pixelSize)

    pixels = Array.from({ length: rows }, () => Array(cols).fill(0))

    resetPixels()

    setTimeout(() => {
        if (!shown) {
            document.getElementById('msg').style.opacity = 1;
            shown = true;
        }
    }, 3000);
}

function draw() {
    background(255);

    if (!timerEnded) {
        let now = floor(millis() / 1000);
        if (now !== lastSecond) {
            if (countdownSeconds > 0) {
                countdownSeconds--;
            } else {
                timerEnded = true;
            }
            lastSecond = now;
        }
        drawCountdownPixellated(countdownSeconds);
    } else {
        document.getElementById('msg').innerText = "Well done!";
        localStorage.setItem('qr10', 'done');
        resetPixels();
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                pixels[i][j] = 1;
            }
        }
        drawPixels();
    }
}

function drawCountdownPixellated(secondsLeft) {
    resetPixels();
    let min = floor(secondsLeft / 60);
    let sec = secondsLeft % 60;
    let timeStr = nf(min, 2) + ":" + nf(sec, 2);

    let fontMap = getFontMap();
    let charWidth = 6;
    let charHeight = 7;
    let totalWidth = timeStr.length * charWidth;
    let startCol = floor((cols - totalWidth) / 2);
    let startRow = floor((rows - charHeight) / 2);

    for (let c = 0; c < timeStr.length; c++) {
        let ch = timeStr[c];
        let glyph = fontMap[ch] || fontMap[' '];
        for (let y = 0; y < charHeight; y++) {
            for (let x = 0; x < 5; x++) {
                if (glyph[y][x]) {
                    let px = startCol + c * charWidth + x;
                    let py = startRow + y;
                    if (py >= 0 && py < rows && px >= 0 && px < cols) {
                        pixels[py][px] = 1;
                    }
                }
            }
        }
    }
    drawPixels();
}

function drawPixels() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (pixels[i][j]) {
                fill(0);
            } else {
                fill(255);
            }
            rect(j * pixelSize, i * pixelSize, pixelSize, pixelSize);
        }
    }
}

function resetPixels() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            pixels[i][j] = 0
        }
    }
}

function distSq(x1, y1, x2, y2) {
    return (x1 - x2) ** 2 + (y1 - y2) ** 2;
}

function getFontMap() {
    return {
        '0': [
            [0, 1, 1, 1, 0],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 1, 1],
            [1, 0, 1, 0, 1],
            [1, 1, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [0, 1, 1, 1, 0]
        ],
        '1': [
            [0, 0, 1, 0, 0],
            [0, 1, 1, 0, 0],
            [1, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [1, 1, 1, 1, 1]
        ],
        '2': [
            [0, 1, 1, 1, 0],
            [1, 0, 0, 0, 1],
            [0, 0, 0, 0, 1],
            [0, 1, 1, 1, 0],
            [1, 0, 0, 0, 0],
            [1, 0, 0, 0, 0],
            [1, 1, 1, 1, 1]
        ],
        '3': [
            [0, 1, 1, 1, 0],
            [1, 0, 0, 0, 1],
            [0, 0, 0, 0, 1],
            [0, 1, 1, 1, 0],
            [0, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [0, 1, 1, 1, 0]
        ],
        '4': [
            [0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0],
            [1, 0, 0, 1, 0],
            [1, 1, 1, 1, 1],
            [0, 0, 0, 1, 0],
            [0, 0, 0, 1, 0],
            [0, 0, 0, 1, 0]
        ],
        '5': [
            [1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0],
            [1, 0, 0, 0, 0],
            [1, 1, 1, 1, 0],
            [0, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [0, 1, 1, 1, 0]
        ],
        '6': [
            [0, 1, 1, 1, 0],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 0],
            [1, 1, 1, 1, 0],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [0, 1, 1, 1, 0]
        ],
        '7': [
            [1, 1, 1, 1, 1],
            [0, 0, 0, 0, 1],
            [0, 0, 0, 1, 0],
            [0, 0, 1, 0, 0],
            [0, 1, 0, 0, 0],
            [0, 1, 0, 0, 0],
            [0, 1, 0, 0, 0]
        ],
        '8': [
            [0, 1, 1, 1, 0],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [0, 1, 1, 1, 0],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [0, 1, 1, 1, 0]
        ],
        '9': [
            [0, 1, 1, 1, 0],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [0, 1, 1, 1, 1],
            [0, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [0, 1, 1, 1, 0]
        ],
        ':': [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ],
        ' ': [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ]
    };
}