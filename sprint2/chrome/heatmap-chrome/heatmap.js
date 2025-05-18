chrome.storage.local.get({ mousePositions: [] }, (result) => {
    const mousePositions = result.mousePositions;
    console.log("Mouse positions:", mousePositions);

    chrome.storage.local.get({ mouseClicks: [] }, (result) => {
        const mouseClicks = result.mouseClicks;
        console.log("Mouse clicks:", mouseClicks);
        createSelects(mousePositions, mouseClicks);
        drawHeatmap(mousePositions, mouseClicks);
    });
});



function createSelects(mousePositions, mouseClicks) {
    const domains = [...new Set(mousePositions.map(pos => pos.domain))];

    const domainSelect = document.createElement('select');
    const defaultDomainOption = document.createElement('option');
    defaultDomainOption.value = '';
    defaultDomainOption.textContent = 'All Domains';
    domainSelect.appendChild(defaultDomainOption);
    domains.forEach(domain => {
        const option = document.createElement('option');
        option.value = domain;
        option.textContent = domain;
        domainSelect.appendChild(option);
    });

    const typeSelect = document.createElement('select');
    const typeOptions = [
        { value: '', text: 'All Types' },
        { value: 'positions', text: 'Mouse Positions' },
        { value: 'clicks', text: 'Mouse Clicks' }
    ];
    typeOptions.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.textContent = option.text;
        typeSelect.appendChild(opt);
    });

    domainSelect.onchange = function () {
        updateHeatmap(this.value, typeSelect.value);
    };
    typeSelect.onchange = function () {
        updateHeatmap(domainSelect.value, this.value);
    };

    const controls = document.getElementById('controls');
    controls.appendChild(domainSelect);
    controls.appendChild(typeSelect);
}

function drawHeatmap(mousePositions, mouseClicks) {
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

    mouseClicks.forEach(pos => {
        const div = document.createElement('div');
        div.className = 'dot click';
        div.style.position = 'absolute';
        div.style.left = `${pos.x}px`;
        div.style.top = `${pos.y}px`;
        heatmapContainer.appendChild(div);
    });
}

function updateHeatmap(domain, type) {
    const heatmapContainer = document.getElementById('heatmap');
    heatmapContainer.innerHTML = '';

    chrome.storage.local.get({ mousePositions: [] }, (respos) => {
        chrome.storage.local.get({ mouseClicks: [] }, (rescli) => {
            let mousePositions = [];
            let mouseClicks = [];
            switch (type) {
                case 'positions':
                    if (domain === '') {
                        mousePositions = respos.mousePositions;
                    } else {
                        mousePositions = respos.mousePositions.filter(pos => pos.domain === domain);
                    }
                    break;
                case 'clicks':
                    if (domain === '') {
                        mouseClicks = rescli.mouseClicks;
                    } else {
                        mouseClicks = rescli.mouseClicks.filter(pos => pos.domain === domain);
                    }
                    break;
                case '':
                default:
                    if (domain === '') {
                        mousePositions = respos.mousePositions;
                        mouseClicks = rescli.mouseClicks;
                    } else {
                        mousePositions = respos.mousePositions.filter(pos => pos.domain === domain);
                        mouseClicks = rescli.mouseClicks.filter(pos => pos.domain === domain);
                    }
                    break;
            }
            drawHeatmap(mousePositions, mouseClicks);
        });
    });
}