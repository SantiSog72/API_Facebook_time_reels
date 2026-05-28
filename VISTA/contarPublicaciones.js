let contador = 0;
const elementosObservados = new Set(); // Para no observar el mismo span dos veces

const observer = new IntersectionObserver((entries) => {
	
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const span = entry.target;
            
            // Verificamos que sea el botón correcto
            if (span.textContent.trim() === "Me gusta") {
				//porque se cuenta dos veces
                contador = contador + 0.5;
                if (contador === Math.trunc(contador)){
                    console.log("¡Me gusta visible! Total:", contador);    
                }
                // Dejamos de observar este botón específico
                observer.unobserve(span);
            }
        }
    });
}, { threshold: 0.5 });

// Función para encontrar y observar spans "Me gusta"
function observarBotonesMeGusta() {
    const todosLosSpans = document.querySelectorAll('span');
    
    todosLosSpans.forEach(span => {
        // Solo observamos si dice "Me gusta" y si no lo hemos añadido antes
        if (span.textContent.trim() === "Me gusta" && !elementosObservados.has(span)) {
            elementosObservados.add(span);
            observer.observe(span);
        }
    });
}

// Ejecutar constantemente para atrapar nuevos elementos al hacer scroll
const mutationObserver = new MutationObserver(() => {
    observarBotonesMeGusta();
});

mutationObserver.observe(document.body, { childList: true, subtree: true });

// Iniciar
observarBotonesMeGusta();
console.log("Observando botones 'Me gusta' directamente...");