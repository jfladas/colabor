import { sites } from '../sites.js';

document.addEventListener('DOMContentLoaded', () => {

    if (
        !localStorage.getItem('qr1') &&
        !localStorage.getItem('qr2') &&
        !localStorage.getItem('qr3') &&
        !localStorage.getItem('qr4') &&
        !localStorage.getItem('qr5') &&
        !localStorage.getItem('qr6') &&
        !localStorage.getItem('qr7') &&
        !localStorage.getItem('qr8') &&
        !localStorage.getItem('qr9') &&
        !localStorage.getItem('qr10') &&
        !localStorage.getItem('qr11') &&
        !localStorage.getItem('qr12') &&
        !localStorage.getItem('qr13') &&
        !localStorage.getItem('qr14') &&
        !localStorage.getItem('qr15')
    ) {
        document.getElementById('overlay').style.display = 'flex';
    } else if (
        localStorage.getItem('final') !== 'no' &&
        localStorage.getItem('qr1') === 'done' &&
        localStorage.getItem('qr2') === 'done' &&
        localStorage.getItem('qr3') === 'done' &&
        localStorage.getItem('qr4') === 'done' &&
        localStorage.getItem('qr5') === 'done' &&
        localStorage.getItem('qr6') === 'done' &&
        localStorage.getItem('qr7') === 'done' &&
        localStorage.getItem('qr8') === 'done' &&
        localStorage.getItem('qr9') === 'done' &&
        localStorage.getItem('qr10') === 'done' &&
        localStorage.getItem('qr11') === 'done' &&
        localStorage.getItem('qr12') === 'done' &&
        localStorage.getItem('qr13') === 'done' &&
        localStorage.getItem('qr14') === 'done' &&
        localStorage.getItem('qr15') === 'done'
    ) {
        localStorage.setItem('final', 'yes');
    }

    const container = document.getElementById('container');
    if (container) {
        for (let i = 1; i <= 16; i++) {
            const qr = localStorage.getItem(`qr${i}`) || '';
            const a = document.createElement('a');
            const num = i < 10 ? `0${i}` : i;
            if (i <= 15) {
                if (qr === 'done') {
                    a.className = 'done field';
                    a.innerHTML = `
                        <h2>#${num}</h2>
                        <h1>${sites[i - 1].title}</h1>
                        <img src="https://unpkg.com/pixelarticons@1.8.1/svg/check.svg" class="icon" />
                    `;
                    a.href = `/qr/${sites[i - 1].id}`;
                } else if (qr === 'found') {
                    a.className = 'found field';
                    a.innerHTML = `
                        <h2>#${num}</h2>
                        <img src="https://unpkg.com/pixelarticons@1.8.1/svg/lock-open.svg" class="icon" />
                    `;
                    a.href = `/qr/${sites[i - 1].id}`;
                } else {
                    a.className = 'field';
                    a.innerHTML = `
                        <h2>#${num}</h2>
                        <img src="https://unpkg.com/pixelarticons@1.8.1/svg/lock.svg" class="icon" />
                    `;
                }
            } else if (i === 16) {
                if (localStorage.getItem('final') === 'yes') {
                    a.className = 'done field';
                    a.innerHTML = `
                        <h2>#${num}</h2>
                        <h1>${sites[i - 1].title}</h1>
                        <img src="https://unpkg.com/pixelarticons@1.8.1/svg/trophy.svg" class="icon" />
                    `;
                    a.href = `/qr/${sites[i - 1].id}`;
                } else {
                    a.className = 'field options';
                    a.innerHTML = `
                        <img src="https://unpkg.com/pixelarticons@1.8.1/svg/more-horizontal.svg" class="icon" />
                    `;
                    a.onclick = function () {
                        document.getElementById('options').style.display = 'flex';
                    }
                }
            }
            container.appendChild(a);
        }
    }
});