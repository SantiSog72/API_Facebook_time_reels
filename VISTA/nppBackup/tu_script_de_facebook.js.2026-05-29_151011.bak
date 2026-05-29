// const url_basica = 'http://localhost/API_Facebook_time_reels/';
const url_basica = 'https://shorter-tidy-theatrics.ngrok-free.dev/API_Facebook_time_reels/';
let publicaciones_totales = 0;
let contador = 0;
let userId = localStorage.getItem('participante_id');

// --- Estilos ---
const cabecera = document.getElementsByTagName("head")[0];
let etiquetaEstilo = document.createElement("style");
etiquetaEstilo.innerHTML = `
    .bloqueado { overflow: hidden !important; }
    #modal-interrupcion {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); z-index: 9999999;
        display: flex; justify-content: center; align-items: center;
    }
`;
cabecera.appendChild(etiquetaEstilo);

// --- Lógica de Observación ---
const elementosObservados = new Set();
const tiempo_inicio = Date.now();

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const span = entry.target;
            if (span.textContent.trim() === "Me gusta") {
                contador += 0.5;
                if (Number.isInteger(contador)) {
                    console.log("¡Me gusta visible! Total:", contador);
                    if (contador >= 5) {
                        let tiempo_interrupcion = Date.now();
                        let total_bloque = contador;
                        publicaciones_totales += total_bloque;
                        contador = 0;
                        mostrarInterrupcion(total_bloque, (tiempo_interrupcion - tiempo_inicio));
                    }
                }
                observer.unobserve(span);
            }
        }
    });
}, { threshold: 0.5 });

function observarBotonesMeGusta() {
    document.querySelectorAll('span').forEach(span => {
        if (span.textContent.trim() === "Me gusta" && !elementosObservados.has(span)) {
            elementosObservados.add(span);
            observer.observe(span);
        }
    });
}

// --- Interrupción ---
function mostrarInterrupcion(cantidad, tiempo_total) {
    const inicioAlerta = Date.now();
    document.body.classList.add('bloqueado');
    
    const modal = document.createElement('div');
    modal.id = 'modal-interrupcion';
    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h2>Tiempo de pausa</h2>
            <p>Publicaciones vistas: ${cantidad}</p>
            <p>Tiempo de sesión: ${Math.round(tiempo_total/1000)}s</p>
            <button id="btn-continuar" style="padding: 10px 20px;">Continuar navegando</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('btn-continuar').onclick = async function() {
        const tiempoReaccion = Date.now() - inicioAlerta;
		console.log ("tiempo de reaccion", tiempoReaccion);
        
        // Enviamos JSON directamente (gracias a la extensión no habrá error CSP)
        // try {
            // const respuesta = await fetch(`${url_basica}CONTROLADOR/guardar_interrupcion.php`, {
                // method: 'POST',
                // headers: { 'Content-Type': 'application/json' },
                // body: JSON.stringify({
                    // participante_id: userId,
                    // publicaciones: cantidad,
                    // tiempo_total: tiempo_total,
                    // tiempo_reaccion: tiempoReaccion
                // })
            // });
            // console.log("Datos enviados al servidor.");
        // } catch (error) {
            // console.error("Error al enviar:", error);
        // }
		
		
        
        document.body.classList.remove('bloqueado');
        modal.remove();
    };
}

// --- Registro Usuario ---
async function registrarSujeto() {
	userId = crypto.randomUUID();
	consle.log ("userId_generado", userId);
	try {
		const respuesta = await fetch(`${url_basica}CONTROLADOR/crear_usuario.php`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ participante_id: userId })
		});
		const resultado = await respuesta.json();
		if (resultado.exito){
			console.log("Registro en BD:", resultado.id);
		}else{
			console.log (resultado.mensaje);
		}
	} catch (error) {
		console.error("Error al registrar:", error);
	}
	
    // if (!userId) {
        // userId = crypto.randomUUID();
		// console.log ("id_generado  (no cargado): ",userId);
        // localStorage.setItem('participante_id', userId);
        
        // try {
            // const respuesta = await fetch(`${url_basica}CONTROLADOR/crear_usuario.php`, {
                // method: 'POST',
                // headers: { 'Content-Type': 'application/json' },
                // body: JSON.stringify({ participante_id: userId })
            // });
            // const resultado = await respuesta.json();
			// if (resultado.exito){
				// console.log("Registro en BD:", resultado.id);
			// }else{
				// console.log (resultado.mensaje);
			// }
        // } catch (error) {
            // console.error("Error al registrar:", error);
        // }
    // }
}

// --- Inicio ---
const mutationObserver = new MutationObserver(observarBotonesMeGusta);
mutationObserver.observe(document.body, { childList: true, subtree: true });

registrarSujeto();
observarBotonesMeGusta();
console.log("Sistema de recolección activo (Extensión modo).");
