let frases = [];
let currentIndex = -1;
let animationId = null;

const VIDEO_WIDTH = 1920;
const VIDEO_HEIGHT = 1080;
const VIDEO_DURATION = 6;
const FRAME_RATE = 30;

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
        animateFraseChange();
    }
}

async function generarVideo() {
    const canvas = document.createElement('canvas');
    canvas.width = VIDEO_WIDTH;
    canvas.height = VIDEO_HEIGHT;
    const ctx = canvas.getContext('2d');

    const fraseActual = frases[currentIndex] || frases[0] || "Tu frase aqui";

    const stars = [];
    for (let i = 0; i < 40; i++) {
        stars.push({
            x: Math.random() * VIDEO_WIDTH,
            y: Math.random() * VIDEO_HEIGHT,
            size: Math.random() * 3 + 1,
            baseAlpha: Math.random() * 0.5 + 0.3,
            twinkleSpeed: Math.random() * 0.02 + 0.01,
            twinkleOffset: Math.random() * Math.PI * 2
        });
    }

    const nebula = {
        x: VIDEO_WIDTH * 0.3,
        y: VIDEO_HEIGHT * 0.3,
        radius: VIDEO_WIDTH * 0.4,
        hue: 230,
        speed: 0.0005
    };

    let startTime = Date.now();
    const frames = [];
    const stream = canvas.captureStream(FRAME_RATE);
    
    const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 5000000
    });

    const chunks = [];
    mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'frase-tufrasedehoy.webm';
        a.click();
        URL.revokeObjectURL(url);
    };

    mediaRecorder.start();

    function drawFrame() {
        const elapsed = (Date.now() - startTime) / 1000;
        
        const gradient = ctx.createLinearGradient(0, 0, 0, VIDEO_HEIGHT);
        gradient.addColorStop(0, '#050510');
        gradient.addColorStop(0.5, '#0a1628');
        gradient.addColorStop(1, '#050510');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);

        const nebulaX = nebula.x + Math.sin(elapsed * nebula.speed * 100) * 30;
        const nebulaY = nebula.y + Math.cos(elapsed * nebula.speed * 100) * 20;
        
        const nebulaGradient = ctx.createRadialGradient(
            nebulaX, nebulaY, 0,
            nebulaX, nebulaY, nebula.radius
        );
        nebulaGradient.addColorStop(0, 'rgba(26, 35, 126, 0.15)');
        nebulaGradient.addColorStop(0.5, 'rgba(13, 27, 42, 0.1)');
        nebulaGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = nebulaGradient;
        ctx.fillRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);

        const nebula2X = VIDEO_WIDTH * 0.8 + Math.sin(elapsed * 0.3) * 20;
        const nebula2Y = VIDEO_HEIGHT * 0.6 + Math.cos(elapsed * 0.2) * 15;
        
        const nebula2Gradient = ctx.createRadialGradient(
            nebula2X, nebula2Y, 0,
            nebula2X, nebula2Y, VIDEO_WIDTH * 0.3
        );
        nebula2Gradient.addColorStop(0, 'rgba(30, 58, 95, 0.1)');
        nebula2Gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = nebula2Gradient;
        ctx.fillRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);

        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            const twinkle = Math.sin(elapsed * star.twinkleSpeed * 60 + star.twinkleOffset);
            const alpha = star.baseAlpha + twinkle * 0.3;
            
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(245, 240, 230, ${Math.max(0.1, alpha)})`;
            ctx.fill();
        }

        const textAlpha = Math.min(1, elapsed / 1.5);
        ctx.save();
        ctx.globalAlpha = textAlpha;
        
        ctx.font = '72px Caveat, cursive';
        ctx.fillStyle = '#f5f0e6';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const words = fraseActual.split(' ');
        let lines = [];
        let currentLine = '';
        
        for (const word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            if (ctx.measureText(testLine).width > 800) {
                if (currentLine) lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine) lines.push(currentLine);
        
        const lineHeight = 80;
        const startY = VIDEO_HEIGHT / 2 - (lines.length - 1) * lineHeight / 2;
        
        lines.forEach((line, index) => {
            ctx.fillText(line, VIDEO_WIDTH / 2, startY + index * lineHeight);
        });
        ctx.restore();

        const dividerAlpha = Math.min(1, (elapsed - 1) / 1);
        ctx.save();
        ctx.globalAlpha = dividerAlpha * 0.5;
        
        ctx.beginPath();
        ctx.moveTo(VIDEO_WIDTH / 2 - 150, VIDEO_HEIGHT / 2 + 80);
        ctx.quadraticCurveTo(
            VIDEO_WIDTH / 2 - 75, VIDEO_HEIGHT / 2 + 78,
            VIDEO_WIDTH / 2, VIDEO_HEIGHT / 2 + 80
        );
        ctx.quadraticCurveTo(
            VIDEO_WIDTH / 2 + 75, VIDEO_HEIGHT / 2 + 82,
            VIDEO_WIDTH / 2 + 150, VIDEO_HEIGHT / 2 + 80
        );
        ctx.strokeStyle = '#f5f0e6';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(VIDEO_WIDTH / 2, VIDEO_HEIGHT / 2 + 80, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#f5f0e6';
        ctx.fill();
        
        ctx.restore();

        if (elapsed < VIDEO_DURATION) {
            requestAnimationFrame(drawFrame);
        } else {
            mediaRecorder.stop();
        }
    }

    drawFrame();
}

async function compartirFrase() {
    const shareBtn = document.getElementById('share-btn');
    
    shareBtn.disabled = true;
    shareBtn.innerHTML = '<span>⏳</span>';
    shareBtn.style.opacity = '0.5';
    
    try {
        await generarVideo();
        
        if (navigator.share) {
            try {
                const response = await fetch('frase-tufrasedehoy.webm');
                const blob = await response.blob();
                const file = new File([blob], 'frase-tufrasedehoy.webm', { type: 'video/webm' });
                
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: 'TuFraseDeHoy',
                        text: 'Una frase para vos'
                    });
                }
            } catch (e) {
                console.log('Web Share no disponible, el video ya se descargó');
            }
        }
    } catch (error) {
        console.error('Error al generar video:', error);
        alert('Error al generar el video. Intenta de nuevo.');
    } finally {
        shareBtn.disabled = false;
        shareBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16,6 12,2 8,6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>';
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