document.getElementById('upload').addEventListener('change', function () {
    const file = this.files[0];
    const status = document.getElementById('status');

    if (!file) {
        status.textContent = 'No file selected.';
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        const base64 = reader.result;
        chrome.storage.local.set({ profileImage: base64 }, () => {
            status.textContent = 'Image saved!';

            // Force the immediate update without waiting for the page reload
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => {
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

                            svg.parentNode.replaceChild(img, svg);
                        });
                    },
                });
            });
        });
    };
    reader.readAsDataURL(file);
});
