if (localStorage.getItem('qr14') !== 'done') {
    localStorage.setItem('qr14', 'found');
}

let pixelSize
let pixels = []
let rows, cols
let mode

let shown = false;

let fallingCircles = [];
let osc, playing = false;
let activeOscillators = []; // Store multiple oscillators for simultaneous sounds

let keyNote = 60;
let keyScale = [0, 2, 4, 5, 7, 9, 11];
const majorScale = [0, 2, 4, 5, 7, 9, 11];
const minorScale = [0, 2, 3, 5, 7, 8, 10];

let keyChangeInterval = 10000;
let lastKeyChange = 0;


function setup() {
    let canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    background(255)
    noStroke()
    frameRate(30)
    fill(0)

    pixelSize = floor(windowHeight / 150)

    mode = 'vertical'

    rows = ceil(windowHeight / pixelSize)
    cols = ceil(windowWidth / pixelSize)

    pixels = Array.from({ length: rows }, () => Array(cols).fill(0))
    lastKeyChange = millis();

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

    resetPixels()
    for (let i = fallingCircles.length - 1; i >= 0; i--) {
        let circle = fallingCircles[i];
        if (circle.active) {
            if (mode == 'white' || mode == 'black') {
                invertCircle(circle.radius, circle.x, circle.y);
            } else {
                obstructCircle(circle.radius, circle.x, circle.y);
            }
            circle.y += circle.vy;
            if (circle.y + circle.radius >= rows) {
                circle.active = false;
                playCircleSound(circle.x, circle.radius);
            }
        }
        if (!circle.active) {
            fallingCircles.splice(i, 1);
        }
    }
    drawPixels()

    if (millis() - lastKeyChange > keyChangeInterval) {
        let root = Math.floor(Math.random() * 12);
        keyNote = 60 + root;
        keyScale = Math.random() < 0.5 ? majorScale : minorScale;
        mode = ['horizontal', 'vertical', 'checkered', 'white', 'black'][Math.floor(Math.random() * 5)];
        lastKeyChange = millis();
    }
}

function drawPixels() {
    clear()
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (pixels[j][i] != 0) {
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
                    if (i - 1 >= 0) {
                        pixels[j][i] = pixels[j][i - 1];
                    } else {
                        pixels[j][i] = 1;
                    }
                }
            }
        }
    } else {
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (distSq(i, j, x, y) <= radius ** 2) {
                    if (j - 1 >= 0) {
                        pixels[j][i] = pixels[j - 1][i];
                    } else {
                        pixels[j][i] = 1;
                    }
                }
            }
        }
    }
}

function mousePressed() {
    document.getElementById('msg').style.opacity = 0;
    shown = true;
    window.userStartAudio && window.userStartAudio();
    if (!osc) {
        osc = new p5.Oscillator();
        osc.setType('sine');
        osc.start();
        osc.amp(0, 0);
    }
    let x = floor(mouseX / pixelSize);
    let y = floor(mouseY / pixelSize);
    let radius = map(y, 0, rows, 10, 1);
    let vy = map(y, 0, rows, 3, 0.5);
    fallingCircles.push({
        x: x,
        y: y,
        radius: radius,
        vy: vy,
        active: true
    });
}

function playCircleSound(x, r) {
    localStorage.setItem('qr14', 'done');
    window.userStartAudio && window.userStartAudio();
    let freq = map(x, 0, cols, 100, 800);
    freq = nearestNoteFreq(freq, keyNote, keyScale);

    let o = new p5.Oscillator();
    o.setType('sine');
    let vol = map(r, 1, 10, 0.005, 0.05);
    o.start();
    o.amp(0, 0);
    o.freq(freq);

    o.amp(vol, 0.5);
    setTimeout(() => {
        o.amp(0, 0.5);
        setTimeout(() => {
            o.stop();
            o.dispose && o.dispose();
        }, 550);
    }, 500);

    activeOscillators.push(o);
}

function nearestNoteFreq(freq, rootMidi, scale) {
    let midi = Math.round(69 + 12 * Math.log2(freq / 440));
    let octave = Math.floor((midi - rootMidi) / 12);
    let scaleDegrees = scale.map(interval => rootMidi + octave * 12 + interval);
    scaleDegrees = scaleDegrees.concat(scale.map(interval => rootMidi + (octave + 1) * 12 + interval));
    let nearest = scaleDegrees.reduce((a, b) => Math.abs(b - midi) < Math.abs(a - midi) ? b : a);
    return midiToFreq(nearest);
}

function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
}

function distSq(x1, y1, x2, y2) {
    return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
}