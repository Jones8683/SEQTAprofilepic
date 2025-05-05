function replaceImage() {
    const svg = document.querySelector('svg.userInfosvg');
    if (!svg) return;

    chrome.storage.local.get('profileImage', (data) => {
        const imageSrc = data.profileImage;
        if (!imageSrc) return;

        const outerCircle = svg.querySelector('path[d*="A10,10"]');
        const innerCircle = svg.querySelector('path[d*="A3,3"]');
        if (outerCircle) outerCircle.style.display = 'none';
        if (innerCircle) innerCircle.style.display = 'none';

        const blackCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        blackCircle.setAttribute('cx', '12');
        blackCircle.setAttribute('cy', '12');
        blackCircle.setAttribute('r', '25');
        blackCircle.setAttribute('fill', 'black');
        svg.appendChild(blackCircle);

        const img = document.createElement('img');
        img.src = imageSrc;
        img.style.width = '40px';
        img.style.height = '40px';
        img.style.borderRadius = '50%';
        img.style.position = 'absolute';
        img.style.left = '50%';
        img.style.top = '50%';
        img.style.transform = 'translate(-50%, -50%)';
        img.style.border = '3px solid white';
        img.style.objectFit = 'cover';
        img.style.aspectRatio = '1/1';
        img.style.overflow = 'hidden';

        svg.parentNode.replaceChild(img, svg);

        const style = document.createElement('style');
        style.textContent = `
            div.userInfosvgdiv.tooltip::before {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    });
}

// Run initially on load
let tries = 0;
const interval = setInterval(() => {
    replaceImage();
    tries++;
    if (tries > 10) clearInterval(interval);
}, 500);
