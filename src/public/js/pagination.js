
// function optenerdisLike(id){
//     var boton = document.getElementById('');
//     document.getElementById('idOptenidodisLike').value = id;
//     boton.click(); 
// }

document.getElementById("pagination").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita la recarga de la página por defecto al enviar el formulario
    const formData = new FormData(this); // Obtiene los datos del formulario
    const url = "/pagination"; // Reemplaza con la URL de tu servidor
 
    fetch(url, {
        method: "POST", // Puedes usar POST u otro método según tu servidor
        body: formData
    })
        .then(response => response.json()) // Parsea la respuesta JSON
        .then(data => {
            const miValorDesdeServidor = data.message;
          
            if(miValorDesdeServidor){
               
            } 
          
        
        })
        .catch(error => {
            console.error("Error:", error);
        });
});
