browser.storage.local.get({ mousePositions: [] }, (result) => {
    const mousePositions = result.mousePositions;
    console.log("Mouse positions:", mousePositions);
    createSelect(mousePositions);
    drawHeatmap(mousePositions);
})

function createSelect(mousePositions) {
    const domains = [...new Set(mousePositions.map(pos => pos.domain))];

    const select = document.createElement('select');
    select.onchange = function () {
        updateHeatmap(this.value);
    };

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'All Domains';
    select.appendChild(defaultOption);

    domains.forEach(domain => {
        const option = document.createElement('option');
        option.value = domain;
        option.textContent = domain;
        select.appendChild(option);
    });

    const controls = document.getElementById('controls') || document.body;
    controls.appendChild(select);
}

function drawHeatmap(mousePositions) {
    const positionCounts = {};
    mousePositions.forEach(pos => {
        const key = `${pos.x},${pos.y}`;
        positionCounts[key] = (positionCounts[key] || 0) + 1;
    });
    const duplicates = [];
    for (const key in positionCounts) {
        if (positionCounts[key] > 1) {
            const [x, y] = key.split(',').map(Number);
            duplicates.push({ x, y, count: positionCounts[key] });
        }
    }
    console.log("Duplicate positions:", duplicates);

    const heatmapContainer = document.getElementById('heatmap');
    mousePositions.forEach(pos => {
        const div = document.createElement('div');
        div.className = 'dot lvl1';
        div.style.position = 'absolute';
        div.style.left = `${pos.x}px`;
        div.style.top = `${pos.y}px`;
        heatmapContainer.appendChild(div);
    });

    duplicates.forEach(pos => {
        const div = document.createElement('div');
        div.className = 'dot lvl' + pos.count;
        div.style.position = 'absolute';
        div.style.left = `${pos.x}px`;
        div.style.top = `${pos.y}px`;
        heatmapContainer.appendChild(div);
    });
}

function updateHeatmap(domain) {
    const heatmapContainer = document.getElementById('heatmap');
    heatmapContainer.innerHTML = '';

    browser.storage.local.get({ mousePositions: [] }, (result) => {
        if (domain === '') {
            drawHeatmap(result.mousePositions);
        } else {
            const mousePositions = result.mousePositions.filter(pos => pos.domain === domain);
            drawHeatmap(mousePositions);
        }
    });
}