function toggleChat(id) {
    socket.emit('client:optenerids', {
        idpublicacion: id,
    })

}

socket.on('server:enviarIdUsuarioremitente', (data, publ) => {

    document.getElementById("chat-container").style.display = 'block';
    document.getElementById("chat-container").style.display = 'flex';
    document.getElementById("nombreUser").innerHTML = publ.usuario;
    document.getElementById('chat-footer').innerHTML = `
            <input type="text" placeholder="Escribe un mensaje..." id="mensaje" autofocus />
        <button type="button" onclick="enviarMensaje('${data}')">Enviar</button>
   
    `
})

function cerrarChat() {
    document.getElementById("chat-container").style.display = 'none';
    document.body.classList.remove('noscroll');

}


function enviarMensaje(idusuarioRemitente) {

    const mensaje = document.getElementById('mensaje').value
    const idUser = document.getElementById('idUser').value
    if (!mensaje) {

    } else {

        socket.emit('client:newMessage', {
            userReceptor: idusuarioRemitente,
            mensaje: mensaje,
            idUser: idUser
        })
        document.getElementById('mensaje').value = ''
    }
}




var userLocal = document.getElementById('idUser').value;
socket.on('server:mensaje', (data, cantidad, notification) => {
    document.getElementById('cuerpomensaje').innerHTML = ""
    data.mensajes.forEach(ms => {
        document.getElementById('cuerpomensaje').innerHTML += `
            <div class="usuario ${ms.idEmisor === userLocal ? 'msgEmisor' : 'msgReceptor'}">
              <span class="nombre-usuario texto">${ms.mensaje}</span>
          </div>
            `
    })


    // document.getElementById('notificacion').innerHTML = ""
    // notification.forEach(nt => {
    //     document.getElementById('notificacion').innerHTML += `
    //     <div class="solicitud btn-outline-secondary" style="width: 400px;">
    //     <div class="usuario">
    //       <img src="/upload/${nt.photo}" alt="Imagen de usuario" class="imagen-usuario imagenChat" style=" height: 20px;width: 20px;">
    //       <div>
    //         <span class="nombre-usuario texto">${nt.NameUserSend}</span><br>
    //         <span class="descripcion">${nt.mensaje}</span>
    //           <small style="padding-left:210px;">${nt.fecha}</small>
    //       </div>
    //       <div>
    //       </div>
    //     </div>
    //   </div>
    //     `
    // })

    // document.getElementById('contador').innerHTML = cantidad
    mantenerContenedorAbajo()
})

function mantenerContenedorAbajo() {
    chatbody.scrollTop = chatbody.scrollHeight;
}