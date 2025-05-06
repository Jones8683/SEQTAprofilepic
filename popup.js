document.getElementById('upload').addEventListener('change', function () {
    const file = this.files[0];
    const status = document.getElementById('status');
    const preview = document.getElementById('preview');

    if (!file) {
        status.textContent = 'No file selected.';
        preview.innerHTML = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        const base64 = reader.result;
        chrome.storage.local.set({
            profileImage: base64,
            profileFilename: file.name
        }, () => {
            status.textContent = `Saved: ${file.name}`;
            preview.innerHTML = `<img src="${base64}" alt="Preview">`;

            // Trigger the image replacement on the webpage
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: replaceImage
                });
            });
        });
    };
    reader.readAsDataURL(file);
});

document.addEventListener('DOMContentLoaded', () => {
    const status = document.getElementById('status');
    const preview = document.getElementById('preview');

    chrome.storage.local.get(['profileImage', 'profileFilename'], (data) => {
        const base64 = data.profileImage;
        const filename = data.profileFilename;

        if (base64) {
            status.textContent = filename ? `Saved: ${filename}` : 'Image already selected.';
            preview.innerHTML = `<img src="${base64}" alt="Preview">`;
        } else {
            status.textContent = 'No file selected.';
            preview.innerHTML = '';
        }
    });
});
