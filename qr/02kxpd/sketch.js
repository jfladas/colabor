if (localStorage.getItem('qr2') !== 'done') {
    localStorage.setItem('qr2', 'found');
}
let pixelSize
let pixels = []
let rows, cols

let video
let vidPixels = []

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    background(255)
    noStroke()
    frameRate(10)

    pixelSize = floor(min(windowWidth, windowHeight) / 100)

    rows = ceil(windowHeight / pixelSize)
    cols = ceil(windowWidth / pixelSize)

    pixels = Array.from({ length: rows }, () => Array(cols).fill(0))
    vidPixels = Array.from({ length: rows }, () => Array(cols).fill(0))

    resetPixels()

    let maxDim = max(cols, rows) * 2;
    video = createCapture(VIDEO)
    video.size(maxDim, maxDim);
    video.hide()

    video.elt.onloadedmetadata = () => {
        let srcW = video.elt.videoWidth;
        let srcH = video.elt.videoHeight;
        let aspectVideo = srcW / srcH;
        let aspectCanvas = cols / rows;

        let bufW = video.width;
        let bufH = video.height;
        let cropX, cropY, cropW, cropH;
        if (aspectCanvas > aspectVideo) {
            cropW = bufW;
            cropH = Math.round(bufW / aspectCanvas);
            cropX = 0;
            cropY = Math.floor((bufH - cropH) / 2);
        } else {
            cropH = bufH;
            cropW = Math.round(bufH * aspectCanvas);
            cropY = 0;
            cropX = Math.floor((bufW - cropW) / 2);
        }
        video.cropInfo = {
            vidW: bufW,
            vidH: bufH,
            cropX,
            cropY,
            cropCols: cropW,
            cropRows: cropH
        };
    };

    video.cropInfo = {
        vidW: video.width,
        vidH: video.height,
        cropX: 0,
        cropY: 0,
        cropCols: video.width,
        cropRows: video.height
    };

    const btn = document.getElementById('download-btn');
    if (btn) {
        btn.addEventListener('click', () => {
            localStorage.setItem('qr2', 'done');
            saveCanvas('selfie', 'png');
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

    obstructVideo()
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
            if ((i + j) % 2 == 0) {
                pixels[i][j] = 0
            } else {
                pixels[i][j] = 1
            }
        }
    }
}

function obstructVideo() {
    video.loadPixels();
    if (video.elt.readyState !== 4) {
        return;
    }
    let { vidW, vidH, cropX, cropY, cropCols, cropRows } = video.cropInfo || {};
    if (!vidW || !vidH) {
        vidW = video.width;
        vidH = video.height;
        cropX = 0;
        cropY = 0;
        cropCols = vidW;
        cropRows = vidH;
    }
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let vi = cropX + floor(i * cropCols / cols);
            let vj = cropY + floor(j * cropRows / rows);
            vi = constrain(vi, 0, vidW - 1);
            vj = constrain(vj, 0, vidH - 1);
            let index = (vj * vidW + vi) * 4;
            let brightness = (video.pixels[index] + video.pixels[index + 1] + video.pixels[index + 2]) / 3;
            vidPixels[j][cols - i - 1] = brightness > 100 ? 0 : 1;

            if (vidPixels[j][i] == 1) {
                if (j > 0) {
                    pixels[j][i] = pixels[j - 1][i]
                } else {
                    pixels[j][i] = 1
                }
            }
        }
    }
}