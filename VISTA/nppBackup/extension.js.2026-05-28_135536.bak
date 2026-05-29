if (typeof raiz === 'undefined') {
	window.raiz = (window.BASE_URL || "/API_Facebook_time_reels/").replace(/\/$/, "") + "/";
}


// Crear el observador
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // El post entró en pantalla. 
            // Incrementar contador de publicaciones vistas.
            contadorPublicaciones++;

            // Opcional: dejar de observar este elemento para no contarlo doble
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 }); // Se activa cuando el 50% del post es visible

// Seleccionar todos los posts actuales y los que irán apareciendo
const posts = document.querySelectorAll('[role="article"]'); 
posts.forEach(post => observer.observe(post));
window.location.contains("https://www.facebook.com/?locale");

// Este código iría en tu content_script.js
window.addEventListener('visibilitychange', function() {
    // Se ejecuta cuando el usuario minimiza, cambia de pestaña o cierra Facebook
    if (document.visibilityState === 'hidden') {
        
        // Aquí recolectas las variables que estuviste midiendo en la sesión
        const datosSesion = {
            id_sujeto: 1, // Esto lo manejarás según cómo identifiques a los usuarios
            tiempo_total_segundos: 1450, // Ejemplo
            total_publicaciones_vistas: 85, // Ejemplo
            estado_interrupcion: true,
            abandono_sitio: true 
        };

        // Enviamos los datos al servidor local
        fetch('${raiz}CONTROLADOR/ProcesaGuardarSesion.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosSesion),
            keepalive: true // ¡Fundamental! Le dice al navegador que complete la petición en segundo plano aunque la pestaña se cierre.
        })
        .catch(error => console.error('Error al enviar datos de la sesión:', error));
    }
});