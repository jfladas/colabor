/**
 * Workshop Kinetic Typography with p5.js
 * © HSLU, 2025, Hanna Zuellig
 * Example textToPoints
 */


let pts = [];
let font;

let params = {
    text: "",
    size: 200,
    sampleFactor: 1,
    circlesize: 2,
    triggerAction: exportSVG
};

function preload() {
    font = loadFont('fonts/307DC5_0_0.ttf');

}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight, SVG);
    /* 
        const gui = new dat.GUI();
        gui.add(params, 'size', 100, 500).name('Text Size').onFinishChange(init);
        gui.add(params, 'sampleFactor', 0.1, 1).name('Sample Factor').onFinishChange(init);
        gui.add(params, 'circlesize', 1, 5).name('Circle Size').onFinishChange(init);
        gui.add(params, 'triggerAction').name("Export SVG");
     */
    init();

    frameRate(6);

}

function draw() {
    background(0);

    clear();
    translate(20, 240);
    fill(255, 255, 255, 50);
    stroke(255, 255, 255, 10);

    for (let i = 0; i < pts.length; i++) {
        for (let j = 0; j < pts[i].length; j++) {
            let pt = pts[i][j];
            let x = pt.x;
            let y = pt.y;

            //strokeWeight((i + 1));
            strokeWeight(params.circlesize);

            let gap = params.size * 0.6;

            //ellipse(x + i * 200, y, params.circlesize, params.circlesize);
            if (i > 0) {
                let pt2 = pts[i - 1][j];
                if (pt2) {
                    let x2 = pt2.x;
                    let y2 = pt2.y;
                    line(x + i * gap, y, x2 + (i - 1) * gap, y2);
                }
            } else {
                let x2 = x - 200;
                let y2 = y;
                line(x + i * gap, y, x2, y2);
            }
        }
    }
}

function init() {
    pts = [];
    for (let i = 0; i < params.text.length; i++) {
        pts[i] = font.textToPoints(params.text[i], 0, 0, params.size, {
            sampleFactor: params.sampleFactor
        });
    }
}

function exportSVG() {
    let d = new Date();
    save(d + ".svg")
    noLoop();
}

function keyPressed() {
    if (key.length === 1) {
        params.text += key;
    }
    if (keyCode === BACKSPACE) {
        params.text = params.text.substring(0, params.text.length - 1);
    }
    init();
}
