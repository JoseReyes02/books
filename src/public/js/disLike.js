
// Supongamos que tienes el ID de la publicación

function quitarGuardado(id){
    document.getElementById('idPublicacion').value = id
    document.getElementById('btnQuitar').click()

}

document.getElementById("formQuitar").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita la recarga de la página por defecto al enviar el formulario
    const formData = new FormData(this); // Obtiene los datos del formulario
    const url = "/publicacion/quitar"; // Reemplaza con la URL de tu servidor
    fetch(url, {
      method: "POST", // Puedes usar POST u otro método según tu servidor
      body: formData
    }) 
      .then(response => response.json()) // Parsea la respuesta JSON
      .then(data => {
         
      quitarPublicacion(data.idPublicacion, data.idUser)
        // Aquí puedes manejar la respuesta del servidor
    
  
      })
      .catch(error => {
        console.error("Error:", error);
      });
  });
  