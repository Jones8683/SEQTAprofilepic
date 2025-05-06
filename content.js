function replaceImage() {
    // Select the target SVG
    const svg = document.querySelector('svg.userInfosvg');
    if (!svg) return;

    // Fetch the stored profile image
    chrome.storage.local.get('profileImage', (data) => {
        const imageSrc = data.profileImage;
        if (!imageSrc) return;

        // Hide existing elements
        const outerCircle = svg.querySelector('path[d*="A10,10"]');
        const innerCircle = svg.querySelector('path[d*="A3,3"]');
        if (outerCircle) outerCircle.style.display = 'none';
        if (innerCircle) innerCircle.style.display = 'none';

        // Add a placeholder circle
        const blackCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        blackCircle.setAttribute('cx', '12');
        blackCircle.setAttribute('cy', '12');
        blackCircle.setAttribute('r', '25');
        blackCircle.setAttribute('fill', 'black');
        svg.appendChild(blackCircle);

        // Replace with the profile image
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

        // Replace the SVG with the image
        svg.parentNode.replaceChild(img, svg);
    });
}

// Immediately run replaceImage on page load
replaceImage();

// Use MutationObserver for dynamic updates
const observer = new MutationObserver(() => {
    replaceImage();
});

// Observe changes in the DOM
observer.observe(document.body, { childList: true, subtree: true });