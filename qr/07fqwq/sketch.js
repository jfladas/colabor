localStorage.setItem('qr7', 'found');

let pixelSize
let pixels = []
let rows, cols
let mode

let shown = false
let shown2 = false

if (typeof Matter === 'undefined') {
    console.error('Matter.js is not defined');
}
const { Engine, Render, World, Bodies, Runner, Body, Events } = Matter;
const engine = Engine.create();
const world = engine.world;
const runner = Runner.create();
Runner.run(runner, engine);

const wallThickness = 60;

const ground = Bodies.rectangle(
    window.innerWidth / 2,
    window.innerHeight + 30,
    window.innerWidth + wallThickness * 2,
    wallThickness,
    { isStatic: true }
);
World.add(world, ground);

const leftWall = Bodies.rectangle(
    -wallThickness / 2,
    window.innerHeight / 2,
    wallThickness,
    window.innerHeight,
    { isStatic: true }
);
World.add(world, leftWall);

const rightWall = Bodies.rectangle(
    window.innerWidth + wallThickness / 2,
    window.innerHeight / 2,
    wallThickness,
    window.innerHeight,
    { isStatic: true }
);
World.add(world, rightWall);

const ceiling = Bodies.rectangle(
    window.innerWidth / 2,
    -wallThickness / 2,
    window.innerWidth + wallThickness * 2,
    wallThickness,
    { isStatic: true }
);
World.add(world, ceiling);

function setup() {
    let side = min(windowWidth, windowHeight)
    let canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    background(255)
    noStroke()
    frameRate(10)

    pixelSize = floor(side / 100)

    rows = ceil(windowHeight / pixelSize)
    cols = ceil(windowWidth / pixelSize)

    mode = 'horizontal'
    step = 0.51

    pixels = Array.from({ length: rows }, () => Array(cols).fill(0))

    resetPixels()

    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("portrait").catch(function (err) {
            console.error("Orientation lock failed: ", err);
        });
    }

    setTimeout(() => {
        if (!shown) {
            document.getElementById('msg').style.opacity = 1;
            shown = true;
        }
    }, 3000);
}

function draw() {
    resetPixels()

    pixellateMatter()

    drawPixels()

    removeOffscreenCircles()

    if (mouseIsPressed) {
        localStorage.setItem('qr7', 'done')
        document.getElementById('msg').style.opacity = 0;
        shown = true;
        addBalls()
    }
}

function handleMotion(event) {
    let gx = 0, gy = 0;
    if (event.gamma !== undefined && event.beta !== undefined) {
        gx = event.gamma / 90;
        gy = event.beta / 90;
    } else if (event.accelerationIncludingGravity) {
        gx = event.accelerationIncludingGravity.x / 9.8;
        gy = event.accelerationIncludingGravity.y / 9.8;
    }
    gx = Math.max(-1, Math.min(1, gx));
    gy = Math.max(-1, Math.min(1, gy));
    engine.gravity.x = gx;
    engine.gravity.y = gy;
}

if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleMotion, true);
} else if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', handleMotion, true);
}

window.addEventListener('orientationchange', () => {
    if (!shown2) {
        document.getElementById('msg').innerText = 'You might need to lock your screen orientation to portrait mode';
        document.getElementById('msg').style.opacity = 1;
        shown2 = true;
        setTimeout(() => {
            document.getElementById('msg').style.opacity = 0;
        }, 3000);
    }
});

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
            pixels[i][j] = 0
        }
    }
}

function removeOffscreenCircles() {
    const toRemove = [];
    for (let body of world.bodies) {
        if (body.circleRadius) {
            const r = body.circleRadius;
            const x = body.position.x;
            const y = body.position.y;
            if (
                x + r < 0 ||
                x - r > windowWidth ||
                y + r < 0 ||
                y - r > windowHeight
            ) {
                toRemove.push(body);
            }
        }
    }
    if (toRemove.length > 0) {
        World.remove(world, toRemove);
    }
}

function distSq(x1, y1, x2, y2) {
    return (x1 - x2) ** 2 + (y1 - y2) ** 2;
}

function addBalls() {
    const radius = pixelSize * 5;
    const x = mouseX;
    const y = mouseY;
    const c = Bodies.circle(x, y, radius + (Math.random() - 0.5) * radius, {
        restitution: 1,
        friction: 0,
        density: 1,
    });
    World.add(world, c);
}

function pixellateMatter() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let px = (i + 0.5) * pixelSize;
            let py = (j + 0.5) * pixelSize;
            for (let body of world.bodies) {
                if (body === ground) continue;
                if (body.circleRadius) {
                    let dx = px - body.position.x;
                    let dy = py - body.position.y;
                    if (dx * dx + dy * dy <= body.circleRadius * body.circleRadius) {
                        pixels[j][i] = 1;
                        break;
                    }
                } else if (body.vertices) {
                    if (Matter.Vertices.contains(body.vertices, { x: px, y: py })) {
                        pixels[j][i] = 1;
                        break;
                    }
                }
            }
        }
    }
}