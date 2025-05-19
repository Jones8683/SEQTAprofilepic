// Function to detect SEQTA copyright comment
function isSEQTA() {
    // Scan the root node for comment nodes
    const nodeIterator = document.createNodeIterator(
        document,
        NodeFilter.SHOW_COMMENT,
        null,
        false
    );
    let currentNode;
    const copyrightText = "~ Copyright (c) SEQTA Software (a division of Saron Education Ltd.) 2014.";
    while ((currentNode = nodeIterator.nextNode())) {
        if (currentNode.nodeValue && currentNode.nodeValue.trim() === copyrightText) {
            return true;
        }
    }
    return false;
}

function replaceImage() {
    // Find the SVG avatar (adjust selector for your SEQTA version if needed)
    const svg = document.querySelector('svg.userInfosvg');
    if (!svg) return;

    chrome.storage.local.get('profileImage', (data) => {
        const imageSrc = data.profileImage;
        if (!imageSrc) return;

        // Hide original SVG circles if they exist
        const outerCircle = svg.querySelector('path[d*="A10,10"]');
        const innerCircle = svg.querySelector('path[d*="A3,3"]');
        if (outerCircle) outerCircle.style.display = 'none';
        if (innerCircle) innerCircle.style.display = 'none';

        // Add a black background circle
        const blackCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        blackCircle.setAttribute('cx', '12');
        blackCircle.setAttribute('cy', '12');
        blackCircle.setAttribute('r', '25');
        blackCircle.setAttribute('fill', 'black');
        svg.appendChild(blackCircle);

        // Create and style the profile image
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

        // Replace the SVG with the profile image
        svg.parentNode.replaceChild(img, svg);
    });
}

// Only run if this is a SEQTA instance
if (isSEQTA()) {
    // Run once on page load
    replaceImage();

    // Watch for DOM changes (SEQTA sometimes reloads the avatar dynamically)
    const observer = new MutationObserver(() => replaceImage());
    observer.observe(document.body, { childList: true, subtree: true });
}
