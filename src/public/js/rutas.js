
function compartirPublicacion(id){
    const ruta = `/vistaSeleccionado/${id}`; // Corrige la ruta para que comience con "/"
    const urlCompleta = `${window.location.origin}${ruta}`; // Construir la URL completa
    
    if (navigator.share) {
        // 📲 Usa la API Web Share en móviles compatibles
        navigator.share({
            title: "Mira esta propiedad",
            text: "Te comparto esta casa que encontré",
            url: urlCompleta
        }).then(() => console.log("Compartido exitosamente"))
        .catch((error) => console.log("Error al compartir:", error));
    } else {
        // 🚀 Fallback: Abrir WhatsApp o copiar el enlace
        const url = encodeURIComponent(urlCompleta);
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(urlCompleta)
            .then(() => alert("Enlace copiado. Pega en cualquier app para compartir."))
            .catch(() => window.open(`https://wa.me/?text=${url}`, "_blank"));
        } else {
            window.open(`https://wa.me/?text=${url}`, "_blank");
        }
    }
}


    // Obtener elementos del DOM
    const notificationBtn = document.getElementById("notificationBtn");
    const notificationPopup = document.getElementById("notificationPopup");

    // Mostrar el popup de notificaciones al hacer clic en el icono
    notificationBtn.addEventListener("click", function (event) {
        // Si el popup ya está abierto, lo cerramos
        if (notificationPopup.style.display === "block") {
            notificationPopup.style.display = "none";
        } else {
            // De lo contrario, lo mostramos
            notificationPopup.style.display = "block";
        }
    });

    // Cerrar el popup si se hace clic fuera de él
    window.addEventListener("click", function (event) {
        // Verificar si el clic fue fuera del popup y fuera del icono
        if (!notificationPopup.contains(event.target) && event.target !== notificationBtn) {
            notificationPopup.style.display = "none";
        }
    });