
document.getElementById("inputFile").addEventListener("change", function(event) {
    const file = event.target.files[0]; // Obtiene el primer archivo seleccionado
    if (file) {
       const imagenName = file.name;
       document.getElementById('imagenName').value = imagenName
       document.getElementById('btnEnviarFoto').click()
       
    } else {
        document.getElementById("fileName").textContent = "No se seleccionó ningún archivo";
    }
});


document.getElementById("enviarImagen").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita la recarga de la página por defecto al enviar el formulario
    const formData = new FormData(this); // Obtiene los datos del formulario
    const url = "/users/changePerfil"; // Reemplaza con la URL de tu servidor
    fetch(url, {
      method: "POST", // Puedes usar POST u otro método según tu servidor
      body: formData
    })
      .then(response => response.json()) // Parsea la respuesta JSON
      .then(data => {
        console.log(data)
        location.reload();
        //  document.getElementById('fotoPerfil').innerHTML = ''
        //  document.getElementById('fotoPerfil').innerHTML = `
        //    <img src="/upload/${data.imagenName}" alt="avatar" 
        //       class="rounded-circle img-fluid" style="width: 150px;">
        //     <input type="file" style="display: none;" id="inputFile"> 
        //     <span class="icon-camera icon-edit-perfil" onclick="inputFileFuncion()"></span>
        //     <h5 class="my-3">${data.nombre}</h5>  
     
          
        //     <div class="d-flex justify-content-center mb-2">
        //       <button type="button" class="btn btn-primary">Follow</button>
        //       <button type="button" class="btn btn-outline-primary ms-1">Message</button>
        //     </div>
        //  `

      })
      .catch(error => {
        console.error("Error:", error);
      });
  });
  
  
  