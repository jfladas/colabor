
/**
 * Workshop Kinetic Typography with p5.js
 * © HSLU, 2025, Hanna Zuellig
 * Example inspired by: https://timrodenbroeker.de/processing-tutorial-kinetic-typography-1/
 * and https://openprocessing.org/sketch/2351903
 */

let font;
let pg;
let scaleFactor = 1;
let tileW;
let tileH;


let params = {
  text: "Corruption",
  size: 240,
  tilesX: 10,
  tilesY: 10,
  triggerStop: startStop,
  triggerAction: exportPNG
};

let isLooping = true;

function preload() {
  font = loadFont("fonts/BiancoSansNewExtraBold.otf");
}

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  pg = createGraphics(windowWidth / scaleFactor, windowHeight / scaleFactor);

  const gui = new dat.GUI();
  gui.add(params, 'text').name('Text Input').onFinishChange(init);
  gui.add(params, 'size', 100, 500).name('Text Size').onFinishChange(init);
  gui.add(params, 'tilesX', 3, 30).name('Anzahl Spalten');
  gui.add(params, 'tilesY', 3, 30).name('Anzahl Zeilen');
  gui.add(params, 'triggerStop').name("Start/Stop");
  gui.add(params, 'triggerAction').name("Export Image");

  init();

  //frameRate(6)

  image(pg, 0, 0, pg.width * scaleFactor, pg.height * scaleFactor);
}

function draw() {

  let w = int(width / params.tilesX);
  let h = int(height / params.tilesY);

  for (let i = 0; i < params.tilesX; i++) {
    for (let j = 0; j < params.tilesY; j++) {
      /*
      let offsetX = random(-10, 10);
      let offsetY = random(-10, 10);
      */

      let offsetX = sin(i * frameCount / 100) * 10;
      let offsetY = sin(j * frameCount / 100) * 10;
      copy(pg, i * w, j * h, w, h, i * w + offsetX, j * h + offsetY, w, h);
    }
  }

  //copy(mouseX, mouseY, 100, 100, mouseX + 10, mouseY + 10, 100, 100);

}




function init() {
  pg.clear();

  pg.blendMode(SCREEN)
  pg.background(0);
  pg.push();
  pg.translate(pg.width / 2, pg.height / 2);
  pg.textAlign(CENTER, CENTER);

  pg.fill(255, 0, 0, 200);
  pg.textFont(font);
  pg.textSize(params.size / scaleFactor);
  pg.text(params.text, 0, 0);

  pg.fill(0, 255, 0, 200);
  pg.textFont(font);
  pg.textSize(params.size / scaleFactor - 2);
  pg.text(params.text, 0, 0);

  pg.fill(0, 0, 255, 200);
  pg.textFont(font);
  pg.textSize(params.size / scaleFactor + 2);
  pg.text(params.text, 0, 0);

  pg.pop();


}

function startStop() {
  if (isLooping) {
    noLoop();
    isLooping = false;
  } else {
    loop();
    isLooping = true;
  }
}


function exportPNG() {
  let d = new Date();
  save(d + ".png")
  noLoop();
}