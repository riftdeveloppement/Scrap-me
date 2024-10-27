let selectedProtocol = '';
const buttons = document.querySelectorAll('button');

function setProtocol(protocol) {
    selectedProtocol = protocol;

    // Désactiver tous les boutons et réinitialiser les classes
    buttons.forEach(button => {
        button.classList.remove('active');
        button.classList.add('inactive');
    });

    // Activer le bouton sélectionné
    document.getElementById(`${protocol.toLowerCase()}-btn`).classList.add('active');

    // Masquer et réinitialiser la section upload et résultats
    const uploadSection = document.getElementById('upload-section');
    const resultSection = document.getElementById('result-section');

    uploadSection.classList.remove('show');
    resultSection.classList.remove('show');

    // Faire réapparaître la section d'upload avec animation
    setTimeout(() => {
        uploadSection.classList.add('show');
    }, 500);
}

async function checkProxies() {
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

    reader.onload = async function(e) {
        const proxies = e.target.result.split('\n');
        for (let proxy of proxies) {
            const isValid = await testProxy(proxy.trim(), selectedProtocol);
            if (isValid) {
                validProxies.push(proxy);
            } else {
                invalidProxies.push(proxy);
            }
        }
        displayResults(validProxies, invalidProxies);
    };

    reader.readAsText(file);
}

async function testProxy(proxy, protocol) {
    const testUrl = 'https://httpbin.org/ip'; // Utilisé pour tester l'IP du proxy

    try {
        // Utiliser le proxy pour faire une requête fetch
        const proxyUrl = `http://${proxy}`; // Construit pour les proxys HTTP/HTTPS
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout après 5 secondes

        const response = await fetch(testUrl, {
            method: 'GET',
            signal: controller.signal,
            mode: 'cors',
            headers: {
                'Proxy-Authorization': proxyUrl
            }
        });

        clearTimeout(timeoutId);

        // Si la requête réussit, on considère le proxy valide
        return response.ok;
    } catch (error) {
        // Si une erreur survient (timeout, problème réseau, etc.), le proxy est invalide
        console.error(`Proxy failed: ${proxy}`, error);
        return false;
    }
}

function displayResults(validProxies, invalidProxies) {
    document.getElementById('validProxies').value = validProxies.join('\n');
    document.getElementById('invalidProxies').value = invalidProxies.join('\n');

    // Afficher la section des résultats avec animation
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
