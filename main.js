let breadcrumbItems = [
    { title: 'Accueil', url: '/' }
];

function addBreadcrumbItem() {
    const titleInput = document.getElementById('pageTitle');
    const urlInput = document.getElementById('pageUrl');
    
    if (titleInput.value && urlInput.value) {
        breadcrumbItems.push({
            title: titleInput.value,
            url: urlInput.value
        });
        
        updateBreadcrumb();
        titleInput.value = '';
        urlInput.value = '';
    }
}

function updateBreadcrumb() {
    const useSlash = document.getElementById('useSlash').checked;
    const useHomeIcon = document.getElementById('useHomeIcon').checked;
    const previewElement = document.getElementById('previewBreadcrumb');
    const codeOutput = document.getElementById('codeOutput');
    const schemaOutput = document.getElementById('schemaCodeOutput');
    
    // Générer le HTML pour l'aperçu
    let previewHtml = '';
    let codeHtml = '<nav class="breadcrumb">\n';
    
    breadcrumbItems.forEach((item, index) => {
        if (index === 0 && useHomeIcon) {
            previewHtml += `<a href="${item.url}">🏠</a>`;
            codeHtml += `    <a href="${item.url}">🏠</a>\n`;
        } else {
            previewHtml += `<a href="${item.url}">${item.title}</a>`;
            codeHtml += `    <a href="${item.url}">${item.title}</a>\n`;
        }
        
        if (index < breadcrumbItems.length - 1) {
            const separator = useSlash ? '/' : '›';
            previewHtml += `<span class="separator">${separator}</span>`;
            codeHtml += `    <span class="separator">${separator}</span>\n`;
        }
    });
    
    codeHtml += '</nav>';
    
    // Générer les données structurées Schema.org
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbItems.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@id": item.url,
                "name": item.title
            }
        }))
    };
    
    const schemaScript = `<script type="application/ld+json">
${JSON.stringify(schemaData, null, 2)}
</script>`;
    
    previewElement.innerHTML = previewHtml;
    codeOutput.textContent = codeHtml;
    schemaOutput.textContent = schemaScript;
}

function copyCode(elementId) {
    const codeOutput = document.getElementById(elementId);
    navigator.clipboard.writeText(codeOutput.textContent)
        .then(() => alert('Code copié dans le presse-papiers !'))
        .catch(err => console.error('Erreur lors de la copie:', err));
}

function switchTab(tab) {
    const htmlOutput = document.getElementById('htmlOutput');
    const schemaOutput = document.getElementById('schemaOutput');
    const buttons = document.querySelectorAll('.tab-button');
    
    buttons.forEach(button => {
        button.classList.remove('active');
        if (button.textContent.toLowerCase().includes(tab)) {
            button.classList.add('active');
        }
    });
    
    if (tab === 'html') {
        htmlOutput.classList.remove('hidden');
        schemaOutput.classList.add('hidden');
    } else {
        htmlOutput.classList.add('hidden');
        schemaOutput.classList.remove('hidden');
    }
}

// Initialisation
document.getElementById('useSlash').addEventListener('change', updateBreadcrumb);
document.getElementById('useHomeIcon').addEventListener('change', updateBreadcrumb);
updateBreadcrumb();