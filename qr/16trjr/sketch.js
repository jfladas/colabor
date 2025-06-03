let tileCount = 16;
let tileRows = 4, tileCols = 4;
let tileW, tileH;

const iframe = window.self !== window.top;
function setup() {
    createCanvas(windowWidth, windowHeight);
    tileW = width / tileCols;
    tileH = height / tileRows;
    if (window.top !== window.self && window.parent !== window.top) {
        return;
    }
    createIframesGrid();
}

function createIframesGrid() {
    selectAll('.qr-iframe').forEach(el => el.remove());
    for (let i = 0; i < tileCount; i++) {
        let col = i % tileCols;
        let row = floor(i / tileCols);
        let iframe = createElement('iframe');
        iframe.class('qr-iframe');
        let src = `../${String(i + 1).padStart(2, '0')}${getQrSuffix(i + 1)}/index.html?lowres=1&fps=10`;
        iframe.attribute('src', src);
        iframe.attribute('loading', 'lazy');
        iframe.style('position', 'absolute');
        iframe.style('left', `${col * tileW}px`);
        iframe.style('top', `${row * tileH}px`);
        iframe.style('width', `${tileW}px`);
        iframe.style('height', `${tileH}px`);
        iframe.style('border', 'none');
        iframe.style('z-index', '1');
        iframe.style('background', 'white');
        iframe.parent(document.body);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    tileW = width / tileCols;
    tileH = height / tileRows;
    createIframesGrid();
}

function getQrSuffix(n) {
    const suffixes = [
        "cimy", "kxpd", "zses", "hdti",
        "xdvb", "qxoc", "fqwq", "ymgo",
        "usaw", "ejzy", "ktdw", "swor",
        "hbem", "xopv", "vrys", "trjr"
    ];
    return suffixes[n - 1];
}