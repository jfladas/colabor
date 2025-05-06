let s;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    background(255)
    s = min(width, height) / 10 - 5
}

function draw() {
    fill(0, 100)
    noStroke()

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            square(i * s + 10 + random(20), j * s + 10 + randomGaussian((5 - abs(i - 5)) * 5, 5), s)
        }
    }

    noLoop()
}