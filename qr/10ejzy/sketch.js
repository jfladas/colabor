if (localStorage.getItem('qr10') !== 'done') {
    localStorage.setItem('qr10', 'found');
}
let pixelSize
let pixels = []
let rows, cols
let mode

let shown = false

let first = true;

let countdownSeconds = 10 * 60;
let lastSecond = 0;
let timerEnded = false;
let init = true;

let messages = [
    { txt: "Wait for 10 minutes", delay: 3000 },
    { txt: "Or don't", delay: 10000 },
    { txt: "I don't care", delay: 20000 },
    { txt: "Maybe I do care...", delay: 60000 },
    { txt: "Do you care?", delay: 120000 },
    { txt: "What do you care about?", delay: 180000 },
    { txt: "About satisfaction? Entertainment? Closure? Meaning?", delay: 210000 },
    { txt: "What if you get none of that?", delay: 270000 },
    { txt: "What if you get nothing?", delay: 300000 },
    { txt: "Will you be disappointed?", delay: 370000 },
    { txt: "Disappointed in yourself?", delay: 400000 },
    { txt: "Disappointed in me?", delay: 430000 },
    { txt: "Should I care?", delay: 490000 },
    { txt: "What do I care about?", delay: 540000 },
    { txt: "I care about you", delay: 590000 },
];
let msg

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

    if (first) {
        msg = document.getElementById('msg');
        for (let m = 0; m < messages.length; m++) {
            setTimeout(() => {
                if (m !== 12 && m !== 13) {
                    msg.innerText = messages[m].txt;
                    msg.style.opacity = 1;
                    setTimeout(() => {
                        msg.style.opacity = 0;
                    }, 3000);
                }
            }, messages[m].delay);
        }
        first = false;
    }
}

function windowResized() {
    setup()
}

function draw() {
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
        if (init) {
            init = false;
            msg.innerText = `I didn't expect you to stay...
            Thank you.`;
            msg.style.opacity = 1;
            localStorage.setItem('qr10', 'done');
            resetPixels();
            makeConfetti();
        } else {
            drawPixels();
        }
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

function makeConfetti() {
    let size = random(1, 3);
    let x = random(cols);
    let y = 0;
    let lastx, lasty;
    let fall = setInterval(() => {
        if (y > rows - size) {
            clearInterval(fall);
            return;
        }
        invertRect(x, y, x + size, y + size);
        if (lastx !== undefined && lasty !== undefined) {
            invertRect(lastx, lasty, lastx + size, lasty + size);
        }
        lastx = x;
        lasty = y;
        y += 0.5;
        if (random() < 0.5) {
            x += random(-1, 1);
        }
    }, 30);
    setTimeout(() => {
        makeConfetti();
    }, random(100));
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

    startX = floor(startX);
    startY = floor(startY);
    endX = floor(endX);
    endY = floor(endY);

    for (let i = startX; i < endX; i++) {
        for (let j = startY; j < endY; j++) {
            pixels[j][i] = 1 - pixels[j][i];
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