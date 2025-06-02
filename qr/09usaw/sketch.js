if (localStorage.getItem('qr9') !== 'done') {
    localStorage.setItem('qr9', 'found');
}
let pixelSize
let pixels = []
let rows, cols
let mode

let shown = false

let first = true

let vid, imgColors = []
let isShaking = false
let lastMouseX = 0, lastMouseY = 0
let shakeThreshold = 200

let lastAccel = { x: 0, y: 0, z: 0 }
let accelShake = false

let shakeIntensity = 0
let lastAccelMag = 0
let accelIntensity = 0

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

    pixels = Array.from({ length: rows }, () => Array(cols).fill(0))

    if (first) {
        vid = createVideo('video.mp4', () => {
            vid.loop()
            vid.volume(0)
            vid.hide()
            vid.play()
        })
        first = false;
    }

    resetPixels()

    setTimeout(() => {
        if (!shown) {
            document.getElementById('msg').style.opacity = 1;
            shown = true;
        }
    }, 3000);

    lastMouseX = mouseX
    lastMouseY = mouseY

    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', function (event) {
            let acc = event.accelerationIncludingGravity
            if (acc) {
                let dx = acc.x - lastAccel.x
                let dy = acc.y - lastAccel.y
                let dz = acc.z - lastAccel.z
                let mag = Math.sqrt(dx * dx + dy * dy + dz * dz)
                accelIntensity = constrain(mag / 20, 0, 1)
                accelShake = mag > 3
                lastAccel.x = acc.x
                lastAccel.y = acc.y
                lastAccel.z = acc.z
            }
        })
    }
}

function windowResized() {
    setup()
}

function draw() {
    updateVideoPixels()
    detectShake()
    drawPixels()
    resetPixels()
}

function updateVideoPixels() {
    if (!vid || vid.width === 0 || vid.height === 0) return
    if (vid.elt.readyState < 2) return
    vid.loadPixels()
    if (!vid.pixels || vid.pixels.length === 0) return

    imgColors = []
    let vw = vid.width
    let vh = vid.height
    let gridAspect = cols / rows
    let videoAspect = vw / vh

    let cropW, cropH, cropX, cropY
    if (videoAspect > gridAspect) {
        cropH = vh
        cropW = Math.floor(vh * gridAspect)
        cropX = Math.floor((vw - cropW) / 2)
        cropY = 0
    } else {
        cropW = vw
        cropH = Math.floor(vw / gridAspect)
        cropX = 0
        cropY = Math.floor((vh - cropH) / 2)
    }

    for (let y = 0; y < rows; y++) {
        let row = []
        let vy = Math.floor(map(y, 0, rows, cropY, cropY + cropH))
        for (let x = 0; x < cols; x++) {
            let vx = Math.floor(map(x, 0, cols, cropX, cropX + cropW))
            let idx = 4 * (vy * vw + vx)
            let r = vid.pixels[idx]
            let g = vid.pixels[idx + 1]
            let b = vid.pixels[idx + 2]
            let gray = 0.299 * r + 0.587 * g + 0.114 * b
            let bw = gray > 127 ? 255 : 0
            row.push([bw, bw, bw])
        }
        imgColors.push(row)
    }
}

function detectShake() {
    let dx = abs(mouseX - lastMouseX)
    let dy = abs(mouseY - lastMouseY)
    let mouseDelta = dx + dy
    let mouseIntensity = constrain(mouseDelta / (2 * shakeThreshold), 0, 1)
    lastMouseX = mouseX
    lastMouseY = mouseY

    shakeIntensity = max(mouseIntensity, accelIntensity)
    isShaking = shakeIntensity > 0

    if (shakeIntensity > 0.8) {
        document.getElementById('msg').style.opacity = 0;
        shown = true;
        localStorage.setItem('qr9', 'done');
    }
}

function drawPixels() {
    clear()
    let totalPixels = cols * rows
    let revealPixels = floor(totalPixels * shakeIntensity)
    let indices = []
    for (let i = 0; i < totalPixels; i++) indices.push(i)
    shuffle(indices, true)
    let revealedSet = new Set(indices.slice(0, revealPixels))

    let idx = 0
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (isShaking && imgColors.length > 0 && revealedSet.has(idx)) {
                let [r, g, b] = imgColors[j][i]
                fill(r, g, b)
            } else {
                let v = random() > 0.5 ? 255 : 0
                fill(v)
            }
            square(i * pixelSize, j * pixelSize, pixelSize)
            idx++
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