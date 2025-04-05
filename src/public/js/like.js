function obtenerLike(id) {
    const url = "/publicaciones/like"; // URL del servidor
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Importante para enviar JSON
        },
        body: JSON.stringify({ id }) // Convertimos el ID en JSON
    })
        .then(response => response.json()) // Convertimos la respuesta a JSON
        .then(data => {
            if(data == 'Primero debes iniciar session!'){
                Swal.fire({
                    title: "Error!",
                    text: data,
                    icon: "warning"
                  });
            }else{
               
                enviarDatoLike(data, id)
            }
   
           
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
        });
}

function quitarGuardado(id){
    const url = "/publicaciones/quitarGuardado"; // URL del servidor
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Importante para enviar JSON
        },
        body: JSON.stringify({ id }) // Convertimos el ID en JSON
    })
        .then(response => response.json()) // Convertimos la respuesta a JSON
        .then(data => {
            quitarGuardado(data, id);
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
        });
}