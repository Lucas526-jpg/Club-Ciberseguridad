// Codigo para generar la animacion de lluvia de Matrix usando un canvas

const colorPrincipal = '#00E880'; 
const colorRastro = '#00B369';    
const listaCaracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}|:<>?-=[]\\;\',./';

// Tamanio visual de cada letra.
const tamanioFuente = 32;

// Velocidad de caida de cada letra (0.2 es lento).
const velocidadCaida = 0.2; 

// Opacidad con la que se limpia el fondo en cada frame (0.98 es casi negro total).
const opacidadRastroFondo = 1; 

// Factor que simula la longitud visible del rastro brillante (0.2 es un rastro corto).
const factorLongitudRastro = 0.2; 

// Factor para aumentar la densidad de columnas. (0.5 duplica las columnas).
const factorDensidadHorizontal = 0.2;
// ----------------------------------------------------

let cantidadColumnas;
let gotas = [];

// Funcion para inicializar el canvas
function iniciarAnimacionMatrix(canvasId = 'matrix-canvas') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error("No se encontro el elemento Canvas con ID 'matrix-canvas'.");
        return;
    }
    
    // Configuracion del contexto 2D
    const ctx = canvas.getContext('2d');

    // Funcion para redimensionar el canvas y recalcular columnas
    function ajustarCanvas() {
        // Ajusta el tamanio del canvas al tamanio de la ventana
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // CLAVE: El numero de columnas se calcula usando el factor de densidad.
        const tamanioEfectivoHorizontal = tamanioFuente * factorDensidadHorizontal;
        cantidadColumnas = Math.floor(canvas.width / tamanioEfectivoHorizontal);

        // Reiniciar las "gotas" para adaptarlas a la nueva anchura
        gotas = [];
        for (let x = 0; x < cantidadColumnas; x++) {
            // Cada gota comienza en una posicion Y aleatoria negativa
            gotas[x] = Math.floor(Math.random() * canvas.height / tamanioFuente) - 20; 
        }
    }

    // Llamamos a la funcion al inicio y cuando se cambia el tamanio de la ventana
    ajustarCanvas();
    window.addEventListener('resize', ajustarCanvas);

    // Funcion principal de dibujo y animacion
    function dibujarFrame() {
        // Fondo semi-transparente negro: crea el rastro de desvanecimiento
        ctx.fillStyle = `rgba(0, 0, 0, ${opacidadRastroFondo})`; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Configuracion del color y fuente del texto
        ctx.font = `${tamanioFuente}px Consolas`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = colorPrincipal; // Sombra con el color principal
        
        // CLAVE: Recalculamos el espaciado efectivo
        const tamanioEfectivoHorizontal = tamanioFuente * factorDensidadHorizontal;

        // Dibujar y actualizar las gotas
        for (let i = 0; i < gotas.length; i++) {
            // Posicion X se calcula con el espaciado efectivo
            const x = i * tamanioEfectivoHorizontal;
            const y = gotas[i] * tamanioFuente;

            // Seleccionar un caracter aleatorio
            const texto = listaCaracteres[Math.floor(Math.random() * listaCaracteres.length)];

            // Aplicamos un color mas brillante a la 'cabeza' de la gota (logica de longitud de rastro)
            const yRelativa = y / canvas.height; // Posicion Y relativa (0.0 a 1.0)
            
            if (yRelativa < factorLongitudRastro * 0.2) {
                // Color mas claro (cabeza de la gota)
                ctx.fillStyle = '#C0FFD8'; 
            } else if (yRelativa < factorLongitudRastro) {
                // Color principal en la parte media/larga del rastro
                ctx.fillStyle = colorPrincipal;
            } else {
                // Color del rastro en la cola
                ctx.fillStyle = colorRastro; 
            }
            
            ctx.fillText(texto, x, y);

            // Hacer que la gota caiga mas lento/rapido basado en velocidadCaida
            // Reiniciar gota si esta fuera de pantalla
            if (y > canvas.height && Math.random() > (0.975 + (0.025 * velocidadCaida))) {
                gotas[i] = 0;
            } else {
                gotas[i] += 1 * velocidadCaida; // Aplica el factor de velocidad
            }
        }
        
        // Solicitar el siguiente frame de animacion
        requestAnimationFrame(dibujarFrame);
    }
    
    // Iniciar el bucle de animacion
    dibujarFrame();
}

// Inicializar la animacion cuando la ventana cargue
window.onload = function() {
    iniciarAnimacionMatrix();
}