import { sites } from '../sites.js';

document.addEventListener('DOMContentLoaded', () => {

    localStorage.setItem('qr16', 'done');

    const container = document.getElementById('container');
    if (container) {
        for (let i = 1; i <= 16; i++) {
            const qr = localStorage.getItem(`qr${i}`) || '';
            const a = document.createElement('a');
            const num = i < 10 ? `0${i}` : i;
            if (qr === 'done') {
                a.className = 'done field';
                a.innerHTML = `
                    <h2>#${num}</h2>
                    <h1>${sites[i - 1].title}</h1>
                    <img src="https://unpkg.com/pixelarticons@1.8.1/svg/check.svg" class="icon" />
                `;
                a.href = `/qr/${sites[i - 1].id}`;
            } else {
                a.className = 'field';
                a.innerHTML = `
                    <h2>#${num}</h2>
                    <img src="https://unpkg.com/pixelarticons@1.8.1/svg/lock.svg" class="icon" />
                `;
            }
            container.appendChild(a);
        }
    }
});