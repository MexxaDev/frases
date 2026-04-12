  let frases = [];

  function mostrarFraseAleatoria() {
    if (frases.length > 0) {
      const indice = Math.floor(Math.random() * frases.length);
      const frase = frases[indice];
      document.getElementById("frase").innerText = frase;
      document.getElementById("capture-text").innerText = frase;
    }
  }

  async function compartirFrase() {
    const captureArea = document.getElementById('capture-area');
    const shareBtn = document.getElementById('share-btn');
    
    shareBtn.disabled = true;
    shareBtn.style.opacity = '0.5';
    
    try {
      const canvas = await html2canvas(captureArea, {
        scale: 1,
        useCORS: true,
        backgroundColor: '#0d1b2a'
      });
      
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], 'frase-tufrasedehoy.png', { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'TuFraseDeHoy',
          text: 'Una frase para vos'
        });
      } else {
        const link = document.createElement('a');
        link.download = 'frase-tufrasedehoy.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    } catch (error) {
      console.error('Error al compartir:', error);
      alert('No se pudo compartir. Descargando imagen...');
      
      const canvas = await html2canvas(captureArea, { scale: 1 });
      const link = document.createElement('a');
      link.download = 'frase-tufrasedehoy.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      shareBtn.disabled = false;
      shareBtn.style.opacity = '0.6';
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