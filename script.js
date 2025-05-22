document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const overlay = document.getElementById('overlay');

    if (header && overlay) {
        header.addEventListener('mouseenter', () => {
            overlay.style.backdropFilter = 'blur(10px)';
        });
        header.addEventListener('mouseleave', () => {
            if (window.scrollY <= 10) {
                overlay.style.backdropFilter = 'blur(0px)';
            }
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
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        for (const span of title.children) {
            const dx = mouseX - (span.getBoundingClientRect().x + span.offsetWidth / 2);
            const dy = mouseY - (span.getBoundingClientRect().y + span.offsetHeight / 2);
            const distance = Math.abs(dx) + Math.abs(dy);
            span.style.fontVariationSettings = `'wdth' ${150 - distance / 20}, 'wght' ${Math.max(1000 - distance, 200)}`;
        }
    }
});

window.addEventListener('scroll', () => {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        if (window.scrollY > 10) {
            overlay.style.backdropFilter = 'blur(10px)';
        } else {
            overlay.style.backdropFilter = 'blur(0px)';
        }
    }
});