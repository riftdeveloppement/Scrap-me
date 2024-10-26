document.getElementById("scrapButton").onclick = function() {
    const url = document.getElementById("urlInput").value;
    if (url) {
        scrapWebsite(url);
    }
};

function scrapWebsite(url) {
    // Simuler le scraping avec un timeout
    setTimeout(() => {
        // Exemple de résultat du scraping
        const result = `Résultats du scraping pour ${url} :\nContenu récupéré...`;
        
        // Afficher le résultat
        document.getElementById("resultText").innerText = result;
        document.getElementById("resultContainer").style.display = "block";

        // Afficher le bouton de téléchargement
        const downloadButton = document.getElementById("downloadButton");
        downloadButton.style.display = "block";
        downloadButton.onclick = function() {
            downloadResult(result);
        };
    }, 1000); // Simuler une attente de 1 seconde pour le scraping
}

function downloadResult(content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'result.txt';
    link.click();
}
