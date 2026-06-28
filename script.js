// ================= SISTEMA DE SEGURIDAD ================= //
const CLAVE_OFUSCADA = "Z2F0byBwYW56b24="; // "gato panzon" en base64

// Listeners de eventos
document.getElementById("btn-entrar").addEventListener("click", verificarPassword);
document.getElementById("btn-recuerdo").addEventListener("click", abrirRecuerdo);
document.getElementById("btn-cerrar").addEventListener("click", cerrarRecuerdo);

// Permitir presionar Enter en el teclado
document.getElementById("pwd").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        verificarPassword();
    }
});

// Cerrar carta al hacer clic en el fondo gris
document.getElementById("memory-modal").addEventListener("click", function(event) {
    if(event.target === this) cerrarRecuerdo();
});

function verificarPassword() {
    const input = document.getElementById('pwd').value.toLowerCase().trim();
    if (btoa(input) === CLAVE_OFUSCADA) {
        desbloquearPagina();
    } else {
        const err = document.getElementById('error-msg');
        err.style.opacity = '1';
        setTimeout(() => err.style.opacity = '0', 3000);
    }
}

function desbloquearPagina() {
    document.getElementById('lock-screen').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('lock-screen').style.display = 'none';
        
        const ui = document.getElementById('ui-layer');
        const audio = document.getElementById('audio-controls');
        ui.style.display = 'block';
        audio.style.display = 'flex';
        
        setTimeout(() => {
            ui.style.opacity = '1';
            audio.style.opacity = '1';
            iniciarUniverso();
        }, 100);
    }, 1500);
}

// ================= LÓGICA DEL MOSAICO INFINITO (CUADRÍCULA) ================= //
const canvas = document.getElementById('photo-universe');
let polaroids = [];

// Tus configuraciones de velocidad y el tamaño del lienzo virtual
let baseSpeed = 0.35; 
let anchoLienzo = window.innerWidth * 1.7;
let altoLienzo = window.innerHeight * 1.7;

document.getElementById('speed-slider').addEventListener('input', (e) => {
    baseSpeed = parseFloat(e.target.value);
});

// ================= EFECTO PARALLAX 3D ================= //
let targetMouseX = 0;
let targetMouseY = 0;
let parallaxX = 0;
let parallaxY = 0;

// Escuchamos el movimiento del mouse
document.addEventListener('mousemove', (e) => {
    // Calculamos la distancia del mouse respecto al centro de la pantalla
    targetMouseX = (e.clientX - window.innerWidth / 2) * 0.08;
    targetMouseY = (e.clientY - window.innerHeight / 2) * 0.08;
});

function iniciarUniverso() {
    // Evita error si "recuerdos" (del fotos.js) no cargó bien
    if (typeof recuerdos === 'undefined' || recuerdos.length === 0) {
        console.error("No se encontraron fotos. Ejecuta el script de Python.");
        return;
    }

    // Calcula cuántas fotos poner al mismo tiempo (tu configuración a 70)
    let numeroDeFotosEnPantalla = Math.min(recuerdos.length, 70); 

    // Lógica de cuadrícula para evitar amontonamientos
    let columnas = Math.ceil(Math.sqrt(numeroDeFotosEnPantalla));
    let filas = Math.ceil(numeroDeFotosEnPantalla / columnas);
    
    let anchoCelda = anchoLienzo / columnas;
    let altoCelda = altoLienzo / filas;

    for(let i = 0; i < numeroDeFotosEnPantalla; i++) {
        let rec = recuerdos[i % recuerdos.length];
        let p = document.createElement('div');
        p.className = 'polaroid';
        p.innerHTML = `<img src="${rec.src}" alt="Fondo polaroid">`;
        
        // Asignamos una fila y columna específica a cada foto
        let col = i % columnas;
        let fila = Math.floor(i / columnas);
        
        // Posición base (su celda) + un margen de aleatoriedad
        let x = (col * anchoCelda) + (Math.random() * (anchoCelda * 0.7));
        let y = (fila * altoCelda) + (Math.random() * (altoCelda * 0.7));
        
        let rot = (Math.random() * 60) - 30; 
        let scale = 0.4 + (Math.random() * 0.45); 
        
        canvas.appendChild(p);
        polaroids.push({ el: p, x: x, y: y, rot: rot, scale: scale });
    }
    requestAnimationFrame(animarFondo);
}

function animarFondo() {
    // Suavizamos el movimiento del mouse para que sea muy fluido
    parallaxX += (targetMouseX - parallaxX) * 0.05;
    parallaxY += (targetMouseY - parallaxY) * 0.05;

    polaroids.forEach(p => {
        p.x -= baseSpeed; 
        p.y -= baseSpeed * 0.6; 
        
        if (p.x < -400) p.x += anchoLienzo;
        if (p.y < -400) p.y += altoLienzo;
        
        // Sumamos la posición base con el efecto parallax multiplicado por la escala
        let posX = p.x + (parallaxX * p.scale * 5);
        let posY = p.y + (parallaxY * p.scale * 5);
        
        p.el.style.transform = `translate3d(${posX}px, ${posY}px, 0) rotate(${p.rot}deg) scale(${p.scale})`;
    });
    requestAnimationFrame(animarFondo);
}

// ================= GENERADOR DE CARTAS ================= //
let velocidadAnterior = 0.35; // Igualado a tu baseSpeed

function abrirRecuerdo() {
    velocidadAnterior = baseSpeed;
    baseSpeed = 0.05; 
    document.getElementById('speed-slider').value = baseSpeed;

    let rec = recuerdos[Math.floor(Math.random() * recuerdos.length)];
    
    document.getElementById('modal-img').src = rec.src;
    document.getElementById('modal-txt').innerText = rec.txt;
    
    document.getElementById('memory-modal').classList.add('active');
}

function cerrarRecuerdo() {
    document.getElementById('memory-modal').classList.remove('active');
    
    baseSpeed = velocidadAnterior;
    document.getElementById('speed-slider').value = baseSpeed;
}

// ================= MENSAJE INSTANTÁNEO (WHATSAPP) ================= //
function enviarRecuerdoWA() {
    // Reemplaza los X con tu número a 10 dígitos
    const numeroCelular = "5550436730"; 
    const mensaje = "Quiero agregar una foto a la página web. Mi dedicatoria es: ";
    
    // Codificamos el mensaje para que la URL lo lea correctamente (convierte espacios en %20)
    const mensajeCodificado = encodeURIComponent(mensaje);
    const url = `https://wa.me/${numeroCelular}?text=${mensajeCodificado}`;
    
    // Abre WhatsApp en una pestaña nueva
    window.open(url, '_blank');
}