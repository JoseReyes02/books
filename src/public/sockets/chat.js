function toggleChat(id) {
    
    socket.emit('client:optenerids', {
        idpublicacion:id,
    })

    // document.getElementById("chat").style.display = 'block';
    // document.body.classList.add('noscroll');

}

socket.on('server:enviarIdUsuarioremitente',(data) =>{

    document.getElementById("chat").style.display = 'block';
    document.body.classList.add('noscroll');
    document.getElementById('btnchat').innerHTML = `
      <button onclick="enviarMensaje('${data}')">Enviar</button>
    `
})

function cerrarChat() {
    document.getElementById("chat").style.display = 'none';
    document.body.classList.remove('noscroll');

}


function enviarMensaje(idusuarioRemitente){

    const mensaje = document.getElementById('mensaje').value
     if(!mensaje){
       
     }else{
      socket.emit('client:enviarMensaje', {
        idusuarioRemitente:idusuarioRemitente,
        mensaje:mensaje
    })
     }
  }