document.getElementById("cargarFoto").addEventListener("submit", function (event) {
  event.preventDefault(); // Evita la recarga de la página por defecto al enviar el formulario
  const formData = new FormData(this); // Obtiene los datos del formulario
  const url = "/publicaciones/cargarFotos"; // Reemplaza con la URL de tu servidor
  fetch(url, {
    method: "POST", // Puedes usar POST u otro método según tu servidor
    body: formData
  })
    .then(response => response.json()) // Parsea la respuesta JSON
    .then(data => {
      if (data.fotos) {
        document.getElementById('showImagen1').style.display = 'none'
        document.getElementById('showImagen2').style.display = 'block'
        document.getElementById('showImagen2').innerHTML = ''

        data.fotos.forEach(fotos => {
          document.getElementById('showImagen2').innerHTML += ` 
         <img src="${fotos.urlImagen}" alt="Cinque Terre" class="aumentar" onclick="thumbnail('${fotos.idImagen}')">
          `
          document.getElementById('cerrar-modal').click();
          deslizarDerecha()
        });
        document.getElementById('loader').style.display = 'none';
      }


    })
    .catch(error => {
      console.error("Error:", error);
    });
});






