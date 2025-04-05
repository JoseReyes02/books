function optenerIdGuardar(id){
    var boton = document.getElementById('enviarIdGuardar');
    document.getElementById('idOptenidoGuardar').value = id;
    boton.click(); 
}

document.getElementById("FormGuardar").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita la recarga de la página por defecto al enviar el formulario
    const formData = new FormData(this); // Obtiene los datos del formulario
    const url = "/publicaciones/guardar"; // Reemplaza con la URL de tu servidor
  
    fetch(url, {
        method: "POST", // Puedes usar POST u otro método según tu servidor
        body: formData
    })
        .then(response => response.json()) // Parsea la respuesta JSON
        .then(data => {
            const miValorDesdeServidor = data.message;
            const meGusta = data.megusta;
            const NomeGusta = data.nomegusta;
            // document.getElementById('mensaje').value = meGusta
            
            if(miValorDesdeServidor){
                Swal.fire({
                    icon: 'warning',
                    title: 'Primero debes iniciar session..',
                    // showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Iniciar session?',
                  }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                      location.href = '/users/signin'
                    } else if (result.isDenied) {
                      Swal.fire('Changes are not saved', '', 'info')
                    }
                  })
            } 
            else if(meGusta){
                // Swal.fire({
                //     position: 'top-end',
                //     icon: 'success',
                //     title: meGusta,
                //     showConfirmButton: false,
                //     timer: 1500
                //   })
                  setTimeout(function() {location.reload();},100);
                // location.reload();
               
                  
            }
            else if(NomeGusta){
                location.reload();
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
});
