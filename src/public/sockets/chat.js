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


    document.getElementById('mensajesList').innerHTML = "" 
    notification.forEach(nt => {
        document.getElementById('mensajesList').innerHTML += `
         <a class="dropdown-item d-flex align-items-center" href="#" onclick="toggleChat('${nt.idConversacion}')">
                                <div class="dropdown-list-image mr-3">
                                    <img class="rounded-circle" src="${nt.photo}" alt="..." style="height: 35px;width:35px">
                                    <div class="status-indicator bg-success"></div>
                                </div>
                                <div class="font-weight-bold">
                                    <div class="text-truncate">${nt.NameUserSend}</div>
                                     <div class="small text-gray-500">${nt.mensaje}</div>
                                </div>
                            </a>
        `
    })

    // document.getElementById('contador').innerHTML = cantidad
    mantenerContenedorAbajo()
})

function mantenerContenedorAbajo() {
    chatbody.scrollTop = chatbody.scrollHeight;
}