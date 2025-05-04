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

            // Send message to content script to update image instantly
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'updateProfileImage' });
            });
        });
    };
    reader.readAsDataURL(file);
});
