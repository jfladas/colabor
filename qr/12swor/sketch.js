localStorage.setItem('qr12', 'done');

let pixelSize
let pixels = []
let rows, cols
let side
let mode

let shown = false

function setup() {
    side = min(windowWidth, windowHeight)
    let canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    background(255)
    noStroke()

    pixelSize = floor(side / 100)

    rows = ceil(windowHeight / pixelSize)
    cols = ceil(windowWidth / pixelSize)

    pixels = Array.from({ length: rows }, () => Array(cols).fill(0))
}

function windowResized() {
    setup()
}

function draw() {

    drawPixels()
    resetPixels()

    setClock()
}

function setClock() {
    let now = new Date();
    let yearday = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let weekday = now.getDay();
    weekday = weekday === 0 ? 7 : weekday;
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let ms = now.getMilliseconds();

    let monthwd = (weekday - (day - 1)) % 7;
    monthwd = monthwd <= 0 ? monthwd + 7 : monthwd;

    if (ms / 1000 < 0.1 || ms / 1000 > 0.9) {
        let colc = 7, cdist = cols / colc, csize = cdist / 3;
        let row = 0;
        for (let d = 0; d < day; d++) {
            let pos = d + monthwd - 1;
            let x = (pos % colc) * cdist + cdist / 2;
            let y = row * cdist + cdist / 2;
            invertRect(x - csize, y - csize, x + csize, y + csize);
            if (pos % colc === colc - 1) {
                row++;
            }
        }

        invertRect((weekday - 1) * cdist + cdist / 2 - csize * 1.5, 0, (weekday - 1) * cdist + cdist / 2 + csize * 1.5, rows);
    }



    invertRect(0, 0, cols, rows * (yearday / 365));

    invertCircleSlice(side / pixelSize / 2.2, cols / 2, rows / 2, seconds / 60 + ms / 60000);
    invertCircleSlice(side / pixelSize / 2.2 + 1, cols / 2, rows / 2, seconds / 60 + ms / 60000);

    invertCircleSlice(side / pixelSize / 2.5, cols / 2, rows / 2, minutes / 60 + seconds / 3600);

    invertCircleSlice(side / pixelSize / 3.5, cols / 2, rows / 2, hours / 24 + minutes / 1440);
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
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            pixels[i][j] = 1
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

function invertCircleSlice(radius, x, y, percentage) {
    let startAngle = 0;
    let endAngle = TWO_PI * percentage;
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (distSq(i, j, x, y) < radius ** 2) {
                let angleToPoint = atan2(j - y, i - x) + HALF_PI;
                if (angleToPoint < 0) {
                    angleToPoint += TWO_PI;
                }
                if (angleToPoint >= startAngle && angleToPoint <= endAngle) {
                    pixels[j][i] = 1 - pixels[j][i];
                }
            }
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