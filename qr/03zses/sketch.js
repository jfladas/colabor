localStorage.setItem('qr3', 'found');

let pixelSize
let pixels = []
let rows, cols
let mode

let height = 0.01
let speed = 0.2

let playing = false
let played = false

const msg = document.getElementById('msg');

function setup() {
    let side = min(windowWidth, windowHeight)
    let canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    background(255)
    noStroke()
    frameRate(10)

    pixelSize = floor(side / 150)

    rows = ceil(windowHeight / pixelSize)
    cols = ceil(windowWidth / pixelSize)

    mode = 'horizontal'
    step = 0.51

    pixels = Array.from({ length: rows }, () => Array(cols).fill(0))

    resetPixels()

    setTimeout(() => {
        if (!played) {
            msg.style.opacity = 1;
            setTimeout(() => {
                if (!played) {
                    msg.innerText = 'Thank you!';
                    localStorage.setItem('qr3', 'done');
                    setTimeout(() => {
                        msg.style.opacity = 0;
                    }, 3000);
                }
            }, 15000);
        }
    }, 3000);
}

function draw() {

    drawPixels()
    resetPixels()

    if (mouseIsPressed) {
        if (height > 0) {
            height -= speed
            if (height < 0) height = 0
        }
    } else {
        if (height < 1) {
            height += speed
            if (height > 1) height = 1
        }
    }

    if (height < 0.01) {
        height = 0
        try {
            triggerAlarm();
        } catch (e) {
            console.error('Error playing sound:', e);
        }
    }
    raisedCircle(60, ceil(cols / 2), ceil(rows / 2) + 5, height)
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

function raisedCircle(radius, x, y, height = 1) {
    obstructCircle(radius, x, y)
    resetCircle(radius, x, y - ceil(radius / 3 * height))
    if (height != 0) {
        invertCircle(radius, x, y - ceil(radius / 3 * height))
    } else {
        resetCircle(radius + 1, x, y)
    }
}

function distSq(x1, y1, x2, y2) {
    return (x1 - x2) ** 2 + (y1 - y2) ** 2;
}

function triggerAlarm() {
    if (playing) return;
    playing = true;
    played = true;
    msg.style.opacity = 0;
    localStorage.setItem('qr3', 'found');
    let audio = new Audio('alarm.wav');
    audio.play();
    audio.onended = () => {
        playing = false;
        location.reload();
    };

    msg.innerText = 'Alarm triggered!';
    msg.style.opacity = 1;

    const flash = document.getElementById('flash');
    flash.innerHTML = '';
    flash.style.opacity = 1;
    setInterval(() => {
        if (flash.style.backgroundColor === 'white') {
            flash.style.backgroundColor = 'black';
        } else {
            flash.style.backgroundColor = 'white';
        }
    }, 500);

}