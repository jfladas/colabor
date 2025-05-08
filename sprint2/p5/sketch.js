let s = function (sketch) {
    sketch.setup = function () {
        //document.body.style.userSelect="none";
        let h = document.body.clientHeight;

        let c = sketch.createCanvas(sketch.windowWidth, h);
        sketch.pixelDensity(1);
        c.position(0, 0);


    }

    sketch.draw = function () {
        sketch.fill(0, 0, 255);
        sketch.noStroke();
        sketch.ellipse(sketch.mouseX, sketch.mouseY, 20, 20)
    }
}

let myp5 = new p5(s);


