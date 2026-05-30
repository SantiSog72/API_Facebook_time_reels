const url_basica = 'http://localhost/API_Facebook_time_reels/';
// const url_basica = 'https://shorter-tidy-theatrics.ngrok-free.dev/API_Facebook_time_reels/';
let publicaciones_totales = 0;
let contador = 0;
let userId = 1;
let  sesionId = null;
let tiempo_inicio = Date.now();
const new_window = window.open("", "ventana_descarga", `width=800,height=600,resizable=yes`);
let cadena_sql = "";


// Equivalente a CURDATE() -> '2026-05-30'
function curDateSQL() {
    const ahora = new Date();
    const year = ahora.getFullYear();
    const month = String(ahora.getMonth() + 1).padStart(2, '0');
    const day = String(ahora.getDate()).padStart(2, '0');
    
    return `'${year}-${month}-${day}'`;
}

// Equivalente a NOW() -> '2026-05-30 18:07:50'
function nowSQL() {
    const ahora = new Date();
    const year = ahora.getFullYear();
    const month = String(ahora.getMonth() + 1).padStart(2, '0');
    const day = String(ahora.getDate()).padStart(2, '0');
    const hours = String(ahora.getHours()).padStart(2, '0');
    const minutes = String(ahora.getMinutes()).padStart(2, '0');
    const seconds = String(ahora.getSeconds()).padStart(2, '0');
    
    return `'${year}-${month}-${day} ${hours}:${minutes}:${seconds}'`;
}


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

	// En mostrarInterrupcion, validar antes de insertar:
	document.getElementById('btn-continuar').onclick = async function() {
		const tiempoReaccion = Date.now() - inicioAlerta;

		let sql = `
			INSERT INTO interrupciones_log 
			(id_sesion, tiempo_transcurrido_segundos, publicaciones_vistas_momento, accion_usuario, tiempo_respuesta_ms, fecha_interrupcion) 
			VALUES ("${(sesionId)}", ${tiempo_total}, ${cantidad}, 'continuar', ${tiempoReaccion}, ${nowSQL()});
		`;
		agregar_sql_body(sql);

		document.body.classList.remove('bloqueado');
		modal.remove();
	};

	// document.getElementById('btn-continuar').onclick = async function() {
	// 	const tiempoReaccion = Date.now() - inicioAlerta;
	// 	console.log("[MI_EXTENSION]: tiempo de reaccion", tiempoReaccion);

	// 	let sql = `
	// 		INSERT INTO interrupciones_log 
    // 		(id_sesion, tiempo_transcurrido_segundos, publicaciones_vistas_momento, accion_usuario, tiempo_respuesta_ms) 
    // 		VALUES ("${sesionId}", ${tiempo_total}, ${cantidad}, 'continuar', ${tiempoReaccion});
	// 	`; 
	// 	agregar_sql_body(sql);
		
	// 	document.body.classList.remove('bloqueado');
	// 	modal.remove();
	// };
}

function sqlStr(valor) {
    if (valor === null || valor === undefined) return 'NULL';
    return `"${String(valor).replace(/\s+/g, '').replace(/"/g, '\\"')}"`;
}

function sanitizarUUID(uuid) {
    return uuid.replace(/\s+/g, '');
}

function esUUIDValido(uuid) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
}

function iniciarSesion() {
    sesionId = crypto.randomUUID().slice(0,8);
	console.log (sesionId);
    // sesionId = sanitizarUUID(raw);


    let sql_inicio_sesion = `
        INSERT INTO sesiones (id_sesion, id_sujeto, fecha, hora_inicio) 
        VALUES ("${(sesionId)}", ${userId}, ${curDateSQL()}, ${nowSQL()});
    `;
    agregar_sql_body(sql_inicio_sesion);
}



function agregar_sql_body (text_sql){
	cadena_sql = cadena_sql.concat(text_sql);
	// let p = document.createElement("p");
	// p.textContent = text_sql;
	// new_window.document.body.appendChild(p);
}

function agregar_sql (){
	let p = document.createElement("span");
	p.textContent = cadena_sql.trim();
	new_window.document.body.appendChild(p);
}

// function iniciarSesion() {
// 	sesionId = crypto.randomUUID();

// 	let sql_inicio_sesion = `
// 		INSERT INTO sesiones (id_sesion, id_sujeto, fecha, hora_inicio) 
// 		VALUES ("${sesionId}", ${userId}, ${curDateSQL()}, ${nowSQL()});
// 	`; 
// 	agregar_sql_body(sql_inicio_sesion);
// }

function cerrarSesion(abandono = false) {
	if (new_window.closed) return;
	const tiempo_total = Math.round((Date.now() - tiempo_inicio) / 1000);
	let sql = `
		UPDATE sesiones SET 
		hora_fin = ${nowSQL()},
		tiempo_total_segundos = ${tiempo_total},
		total_publicaciones_vistas = ${publicaciones_totales},
		abandono_sitio = "abandono"
		WHERE id_sesion = "${sesionId}";
	`; 
	agregar_sql_body(sql);
	agregar_sql();

	new_window.print();
	new_window.close();
	
}


// Detectar cierre de pestaña/navegador
window.addEventListener('beforeunload', () => cerrarSesion(true));

try {
	// --- Inicio ---
	const mutationObserver = new MutationObserver(observarBotonesMeGusta);
	mutationObserver.observe(document.body, { childList: true, subtree: true });


	iniciarSesion();
	console.log("[MI_EXTENSION]: id_sesion", sesionId);
	observarBotonesMeGusta();
	console.log("[MI_EXTENSION]: Sistema de recolección activo (Extensión modo).");

} catch (error) {
	console.error("[MI_EXTENSION]: Error extension:", error);
}