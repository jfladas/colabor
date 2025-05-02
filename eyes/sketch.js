let xx = 0;
let yy = 0;

let tilesX, tilesY;
let gridX, gridY, grid;
let centerX, centerY;
let eyeDistance;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);

    tilesX = floor(width / 100);
    tilesY = floor(height / 80);


    gridX = width / tilesX;
    gridY = height / tilesY;
    grid = gridX < gridY ? gridX : gridY;

    noStroke();
    rectMode(CENTER);

}

function draw() {
    background(0);
    noStroke();

    // Use mouse position data
    xx = mouseX;
    yy = mouseY;

    drawGrid();
}


function drawGrid() {
    for (let y = 0; y < tilesY; y++) {
        for (let x = 0; x < tilesX; x++) {

            centerX = x * gridX + (gridX / 2);
            centerY = y * gridY + (gridY / 2);

            eyeDistance = grid * 0.2;

            fill(255)
            ellipse(centerX - eyeDistance, centerY, grid * 0.3, grid * 0.3);
            diffX = map(xx, centerX - width / 2, centerX + width / 2, -grid * 0.1, grid * 0.1);
            diffY = map(yy, centerY - height / 2, centerY + height / 2, -grid * 0.1, grid * 0.1);

            fill(0);
            ellipse(centerX - eyeDistance + diffX, centerY + diffY, grid * 0.2, grid * 0.2);

            fill(255)
            ellipse(centerX + eyeDistance, centerY, grid * 0.3, grid * 0.3);
            diffX = map(xx, centerX - width / 2, centerX + width / 2, -grid * 0.1, grid * 0.1);
            diffY = map(yy, centerY - height / 2, centerY + height / 2, -grid * 0.1, grid * 0.1);

            fill(0);
            ellipse(centerX + eyeDistance + diffX, centerY + diffY, grid * 0.2, grid * 0.2);

            if (random() > 0.9995) {
                animateBlink(centerX, centerY);
            }
        }
    }
}

function animateBlink(x, y) {
    let div = createDiv('');
    div.style('position', 'absolute');
    div.style('width', `${gridX}px`);
    div.style('height', `${grid / 2}px`);
    div.class('blink top');
    div.position(x - gridX / 2, y - grid * 0.7);

    let div2 = createDiv('');
    div2.style('position', 'absolute');
    div2.style('width', `${gridX}px`);
    div2.style('height', `${grid / 2}px`);
    div2.class('blink bottom');
    div2.position(x - gridX / 2, y + grid * 0.2);

    setTimeout(() => {
        div.remove();
        div2.remove();
    }, 2000);
}