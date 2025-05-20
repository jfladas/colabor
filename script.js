document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const overlay = document.getElementById('overlay');

    if (header && overlay) {
        header.addEventListener('mouseenter', () => {
            overlay.style.backdropFilter = 'blur(10px)';
        });
        header.addEventListener('mouseleave', () => {
            overlay.style.backdropFilter = 'blur(0px)';
        });
    }

    const title = document.getElementById('title').children[0];
    if (title) {
        const text = title.textContent;
        title.textContent = '';
        for (const char of text) {
            const span = document.createElement('span');
            span.textContent = char;
            title.appendChild(span);
        }
    }
});

document.addEventListener('mousemove', (event) => {
    const title = document.getElementById('title').children[0];
    if (title) {
        for (const span of title.children) {
            const dx = event.clientX - (span.getBoundingClientRect().x + span.offsetWidth / 2);
            const dy = event.clientY - (span.getBoundingClientRect().y + span.offsetHeight / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            span.style.fontVariationSettings = `'wdth' ${150 - distance / 20}, 'wght' ${1000 - distance}`;
        }
    }
});