// Al cargar la página
window.onload = () => {
    const uuid = localStorage.getItem('participante_id');
    
    fetch('registrar_inicio.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            uuid: uuid,
            url: window.location.href 
        })
    })
    .then(res => res.json())
    .then(data => {
        // Guardamos el ID de esta sesión específica para cerrarla después
        sessionStorage.setItem('current_session_id', data.id_sesion);
    });
};

// al cerrar
window.addEventListener('beforeunload', () => {
    const sessionId = sessionStorage.getItem('current_session_id');
    const uuid = localStorage.getItem('participante_id');

    if (sessionId) {
        const url = 'registrar_fin.php';
        const data = new FormData();
        data.append('id_sesion', sessionId);
        data.append('uuid', uuid);

        navigator.sendBeacon(url, data);
    }
});