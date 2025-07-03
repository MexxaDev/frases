
  let frases = [];

  // Función para mostrar una frase aleatoria
  function mostrarFraseAleatoria() {
    if (frases.length > 0) {
      const indice = Math.floor(Math.random() * frases.length);
      const frase = frases[indice];
      document.getElementById("frase").innerText = frase;
    }
  }

  // Cargar el archivo JSON externo
  fetch("frases_completas.json")
    .then(response => response.json())
    .then(data => {
      frases = data;
      mostrarFraseAleatoria(); // Mostrar la primera frase
      setInterval(mostrarFraseAleatoria, 150000); // Cada 50 segundos
    })
    .catch(error => console.error("Error al cargar frases:", error));
