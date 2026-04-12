let frases = [];
let currentIndex = -1;

function getRandomIndex() {
    if (frases.length <= 1) return 0;
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * frases.length);
    } while (newIndex === currentIndex);
    return newIndex;
}

function animateFraseChange() {
    const fraseEl = document.getElementById('frase');
    fraseEl.style.animation = 'none';
    fraseEl.offsetHeight;
    fraseEl.style.animation = 'fade-in 2s ease-out forwards';
}

function mostrarFraseAleatoria() {
    if (frases.length > 0) {
        currentIndex = getRandomIndex();
        const frase = frases[currentIndex];
        document.getElementById("frase").innerText = frase;
        document.getElementById("capture-text").innerText = frase;
        animateFraseChange();
    }
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function compartirFrase() {
    const shareBtn = document.getElementById('share-btn');
    const originalContent = shareBtn.innerHTML;
    
    shareBtn.disabled = true;
    shareBtn.innerHTML = '<span style="font-size:20px;">⏳</span>';
    shareBtn.style.opacity = '0.5';
    
    try {
        const captureArea = document.getElementById('capture-area');
        
        const canvas = await html2canvas(captureArea, {
            scale: 1,
            useCORS: true,
            backgroundColor: '#050510',
            width: 1080,
            height: 1920
        });
        
        const dataUrl = canvas.toDataURL('image/png');
        
        const link = document.createElement('a');
        link.download = 'frase-tufrasedehoy.png';
        link.href = dataUrl;
        link.click();
        
        let shared = false;
        if (navigator.share) {
            try {
                const response = await fetch(dataUrl);
                const blob = await response.blob();
                const file = new File([blob], 'frase-tufrasedehoy.png', { type: 'image/png' });
                
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: 'TuFraseDeHoy',
                        text: 'Una frase para vos'
                    });
                    shared = true;
                }
            } catch (e) {
                console.log('Web Share no disponible');
            }
        }
        
        if (!shared) {
            setTimeout(() => {
                alert('✅ Imagen descargada!\n\nPara compartir en Instagram:\n1. Abre Instagram\n2. Crea una nueva publicación/story\n3. Selecciona la imagen descargada');
            }, 500);
        }
        
    } catch (error) {
        console.error('Error al generar imagen:', error);
        alert('Error al generar la imagen. Intenta de nuevo.');
    } finally {
        shareBtn.disabled = false;
        shareBtn.innerHTML = originalContent;
        shareBtn.style.opacity = '1';
    }
}

document.getElementById('share-btn').addEventListener('click', compartirFrase);

fetch("frases_completas.json")
    .then(response => response.json())
    .then(data => {
        frases = data;
        mostrarFraseAleatoria();
        setInterval(mostrarFraseAleatoria, 150000);
    })
    .catch(error => console.error("Error al cargar frases:", error));