const url_basica = 'http://localhost/API_Facebook_time_reels/';
// const url_basica = 'https://shorter-tidy-theatrics.ngrok-free.dev/API_Facebook_time_reels/';
let publicaciones_totales = 0;
let contador = 0;
let userId = null;
let sesionId = null;
let tiempo_inicio = Date.now();


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

const observer = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			const span = entry.target;
			if (span.textContent.trim() === "Me gusta") {
				contador += 0.5;
				if (Number.isInteger(contador)) {
					console.log("[MI_EXTENSION]: ¡Me gusta visible! Total:", contador);
					if (contador >= 5) {
						let tiempo_interrupcion = Date.now();
						let total_bloque = contador;
						publicaciones_totales += total_bloque;
						contador = 0;
						mostrarInterrupcion(publicaciones_totales, (tiempo_interrupcion - tiempo_inicio));
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
		console.log("[MI_EXTENSION]: tiempo de reaccion", tiempoReaccion);
		
		try {
			const respuesta = await fetch(`${url_basica}CONTROLADOR/guardar_interrupcion.php`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id_sesion: sesionId,
					tiempo_total: tiempo_total,
					publicaciones: cantidad,
					accion_usuario: 'continuar',
					tiempo_reaccion: tiempoReaccion
				})
			});
			console.log("[MI_EXTENSION]: Datos enviados al servidor.");
		} catch (error) {
			console.error("[MI_EXTENSION]: Error al enviar:", error);
		}
		
		document.body.classList.remove('bloqueado');
		modal.remove();
	};
}

async function registrarSujeto() {
	userId = crypto.randomUUID();
	console.log("[MI_EXTENSION]: Nuevo ID generado:", userId);
	try {
		const respuesta = await fetch(`${url_basica}CONTROLADOR/crear_usuario.php`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ participante_id: userId })
		});
		const resultado = await respuesta.json();
		if (resultado.exito){
			console.log("[MI_EXTENSION]: Registro en BD:", resultado);
		}else{
			console.log ("[MI_EXTENSION]: Registro en BD:", resultado.mensaje);
		}
	} catch (error) {
		console.error("[MI_EXTENSION]: Error al registrar en BD:", error);
	}

}


// --- Inicialización ---
async function inicializar() {
	chrome.storage.local.get(['participante_id'], (result) => {
    if (result.participante_id) {
        console.log("ID:", result.participante_id);
    } else {
        console.log("No existe");
    }
	});
	
	// 1. Obtener o crear userId
	await new Promise((resolve) => {
		chrome.storage.local.get(['participante_id'], async (result) => {
			if (result.participante_id) {
				userId = result.participante_id;
				console.log("[MI_EXTENSION]: Usuario existente:", userId);
				resolve();
			} else {
				userId = crypto.randomUUID();
				chrome.storage.local.set({ 'participante_id': userId });
				console.log("[MI_EXTENSION]: Nuevo ID generado:", userId);
				
				try {
					const respuesta = await fetch(`${url_basica}CONTROLADOR/crear_usuario.php`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ participante_id: userId })
					});
					const resultado = await respuesta.json();
					if (resultado.exito) {
						console.log("[MI_EXTENSION]: Registro en BD:", resultado);
					} else {
						console.log("[MI_EXTENSION]: Registro en BD:", resultado.mensaje);
					}
				} catch (error) {
					console.error("[MI_EXTENSION]: Error al registrar en BD:", error);
				}
				resolve();
			}
		});
	});

	// 2. userId listo → iniciar sesión
	await iniciarSesion();
}

async function iniciarSesion() {
	try {
		const respuesta = await fetch(`${url_basica}CONTROLADOR/iniciar_sesion.php`, {
			method: 'POST'
		});
		
		const resultado = await respuesta.json();
		
		sesionId = resultado.id_sesion;
		console.log("[MI_EXTENSION]: Sesión iniciada:", sesionId);
		
	} catch (error) {
		console.error("[MI_EXTENSION]: Error al iniciar sesión:", error.message);
	}
}

async function cerrarSesion(abandono = false) {
	if (!sesionId) return;
	const tiempo_total = Math.round((Date.now() - tiempo_inicio) / 1000);
	
	// sendBeacon con JSON (Blob necesario para poder setear Content-Type)
	try {
		const datos = JSON.stringify({
			id_sesion: sesionId,
			tiempo_total_segundos: tiempo_total,
			total_publicaciones_vistas: publicaciones_totales,
			abandono_sitio: abandono
		});
		navigator.sendBeacon(
			`${url_basica}CONTROLADOR/cerrar_sesion.php`,
			new Blob([datos], { type: 'application/json' })
		);
	}catch (error){
		console.error("[MI_EXTENSION]: Error al cerrar sesión:", error);
	}
}

// Detectar cierre de pestaña/navegador
window.addEventListener('beforeunload', () => cerrarSesion(true));

try {
	// --- Inicio ---
	const mutationObserver = new MutationObserver(observarBotonesMeGusta);
	mutationObserver.observe(document.body, { childList: true, subtree: true });

	registrarSujeto();

	iniciarSesion();
	console.log("[MI_EXTENSION]: id_sesion", sesionId);
	observarBotonesMeGusta();
	console.log("[MI_EXTENSION]: Sistema de recolección activo (Extensión modo).");

} catch (error) {
	console.error("[MI_EXTENSION]: Error extension:", error);
}