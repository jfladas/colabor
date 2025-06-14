if (localStorage.getItem('qr6') !== 'done') {
    localStorage.setItem('qr6', 'found');
}
let pixelSize
let pixels = []
let rows, cols

let video
let isRearCamera = false

const iframe = window.self !== window.top;
function setup() {
    let side = min(windowWidth, windowHeight)
    let canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    background(255)
    noStroke()
    frameRate(10)

    pixelSize = floor(side / 150)
    if (iframe) {
        pixelSize = 5;
        document.getElementById('download-btn').style.display = 'none';
    }

    rows = ceil(windowHeight / pixelSize)
    cols = ceil(windowWidth / pixelSize)

    pixels = Array.from({ length: rows }, () => Array(cols).fill(0))

    resetPixels()

    let constraints = {
        video: {
            facingMode: { exact: "environment" }
        },
        audio: false
    };
    if (iframe) {
        let constraints = {
            video: {
                facingMode: { exact: "user" }
            },
            audio: false
        };
    }

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            isRearCamera = true
            video = createCapture(constraints);
            video.size(cols, rows)
            video.hide()
        })
        .catch(function (err) {
            isRearCamera = false
            video = createCapture({ video: true, audio: false });
            video.size(cols, rows)
            video.hide()
        });

    const btn = document.getElementById('download-btn');
    if (btn) {
        btn.addEventListener('click', () => {
            localStorage.setItem('qr6', 'done');
            saveCanvas('lens-filter', 'png');
            resetPixels();
        });
    }
}

function windowResized() {
    setup()
}

function draw() {

    drawPixels()
    resetPixels()

    ditherVideo()
}

function drawPixels() {
    clear()
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (pixels[j][i] != 0) {
                fill(0)
                square(i * pixelSize, j * pixelSize, pixelSize)
            } else {
                fill(255)
                square(i * pixelSize, j * pixelSize, pixelSize)
            }
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

function ditherVideo() {
    if (!video) return;
    video.loadPixels();
    if (video.elt.readyState !== 4) {
        return;
    }
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let index;
            if (!isRearCamera) {
                let mirroredI = video.width - i - 1;
                index = (j * video.width + mirroredI) * 4
            } else {
                index = (j * video.width + i) * 4
            }
            let brightness = (video.pixels[index] + video.pixels[index + 1] + video.pixels[index + 2]) / 3
            if (brightness < 50) {
                pixels[j][i] = 1
            } else if (brightness < 80) {
                if (i % 2 == 0 && j % 2 == 0) {
                    pixels[j][i] = 0
                } else {
                    pixels[j][i] = 1
                }
            } else if (brightness < 120) {
                if ((i + j) % 2 == 0) {
                    pixels[j][i] = 1
                } else {
                    pixels[j][i] = 0
                }
            } else if (brightness < 200) {
                if (i % 2 == 0 && j % 2 == 0) {
                    pixels[j][i] = 1
                } else {
                    pixels[j][i] = 0
                }
            }
            else {
                pixels[j][i] = 0
            }
        }
    }
}