let selectedProtocol = '';

function setProtocol(protocol) {
    selectedProtocol = protocol;
    alert(`Protocol selected: ${protocol}`);

    // Make the upload section appear with animation
    const uploadSection = document.getElementById('upload-section');
    uploadSection.classList.add('show');

    // Hide result section until we check the proxies
    const resultSection = document.getElementById('result-section');
    resultSection.classList.remove('show');
}

function checkProxies() {
    const fileInput = document.getElementById('proxyFile');
    const validProxies = [];
    const invalidProxies = [];

    if (!selectedProtocol) {
        alert("Please select a protocol!");
        return;
    }

    if (!fileInput.files.length) {
        alert("Please upload a proxy list.");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const proxies = e.target.result.split('\n');

        // Simulating proxy checking
        proxies.forEach(proxy => {
            if (Math.random() > 0.5) {
                validProxies.push(proxy);
            } else {
                invalidProxies.push(proxy);
            }
        });

        displayResults(validProxies, invalidProxies);
    };

    reader.readAsText(file);
}

function displayResults(validProxies, invalidProxies) {
    document.getElementById('validProxies').value = validProxies.join('\n');
    document.getElementById('invalidProxies').value = invalidProxies.join('\n');

    // Show the result section with animation
    const resultSection = document.getElementById('result-section');
    resultSection.classList.add('show');
}

function downloadValidProxies() {
    const validProxies = document.getElementById('validProxies').value;

    if (!validProxies) {
        alert("No valid proxies to download!");
        return;
    }

    const blob = new Blob([validProxies], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'result-valid-proxies.txt';
    link.click();
}
