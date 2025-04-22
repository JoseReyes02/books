var userLocal = document.getElementById('idUser').value;
function crearChat(idpublicacion) {
    const idUser = document.getElementById('idUser').value
    socket.emit('client:crearChat', {
        idpublicacion: idpublicacion,
        idUser: idUser
    })

}
//se cargan los mensajes de cada usuario al iniciar la pagina
socket.on('server:cargarMensajes', (notification) => {
    for (let i = 0; i < notification.length; i++) {
        const idUser = notification[i].idUser
        const userReceptor = notification[i].userReceptor

        if (idUser === userLocal || userReceptor === userLocal) {
            document.getElementById('mensajesList').innerHTML += `
               <a class="dropdown-item d-flex align-items-center" href="#" onclick="abrirChat('${notification[i].idConversacion}')">
                                      <div class="dropdown-list-image mr-3">
                                          <img class="rounded-circle" src="${notification[i].photo}" alt="..." style="height: 35px;width:35px">
                        
                                  </div>
                                     <div class="font-weight-bold">
                                         <div class="text-truncate">${notification[i].idUser === userLocal ? notification[i].nombreUserReceptor : notification[i].nombreUserEmisor}</div>
                                          <div class="small text-gray-500">${notification[i].ultimoId === userLocal ? 'Tu: ' : ''} ${notification[i].mensaje}</div>
                                    </div>
                                </a>
      
           `
        }
    }
})


function abrirChat(id) {
    const idUser = document.getElementById('idUser').value
    socket.emit('client:abrirChat', {
        idchat: id,
        idUser: idUser
    })

}

function abrirChatUser(id) {
    const idUser = document.getElementById('idUser').value
    socket.emit('client:abrirChatUser', {
        userReceptor: id,
        userLocal: idUser
    })

}

socket.on('server:chatCreado', (idchat, chats, nombre) => {
    document.getElementById("chat-container").style.display = 'block';
    document.getElementById("chat-container").style.display = 'flex';
    document.getElementById("nombreUser").innerHTML = nombre
    document.getElementById('chat-footer').innerHTML = `
        <input type="text" placeholder="Escribe un mensaje..." id="mensaje" onclick="activarMensaje()" autocomplete="off" autofocus />
    <button type="button" onclick="enviarMensaje('${idchat}')">Enviar</button>

`

    document.getElementById('cuerpomensaje' + userLocal).innerHTML = ""
    chats.mensajes.forEach(ms => {
        document.getElementById('cuerpomensaje' + userLocal).innerHTML += `
            <div class="usuario ${ms.userEmisor === userLocal ? 'msgEmisor' : 'msgReceptor'}">
              <span class="nombre-usuario texto">${ms.mensaje}</span>
              <small class="text-gray-500 horaMensaje">${ms.hora}</small>
          </div>
            `
    })
    if (window.innerWidth <= 768) {
        document.body.style.overflow = 'hidden';
      }
    mantenerContenedorAbajo()


})

function enviarMensaje(idchat) {
    const mensaje = document.getElementById('mensaje').value
    const idUser = document.getElementById('idUser').value
    if (!mensaje) {

    } else {

        socket.emit('client:newMessage', {
            mensaje: mensaje,
            idchat: idchat,
            idUser: idUser
        })
        document.getElementById('mensaje').value = ''
        document.getElementById('mensaje').focus()
    }
}


socket.on('server:chatAbierto', (data, chats, notification, nombreReceptor) => {
    document.getElementById('cuerpomensaje' + userLocal).innerHTML = ""
    chats.mensajes.forEach(ms => {
        document.getElementById('cuerpomensaje' + userLocal).innerHTML += `
            <div class="usuario ${ms.idEmisor === userLocal ? 'msgEmisor' : 'msgReceptor'}">
              <span class="nombre-usuario texto">${ms.mensaje}</span>
              <small class="text-gray-500 horaMensaje">${ms.hora}</small>
          </div>
            `
    })

    document.getElementById("chat-container").style.display = 'block';
    document.getElementById("chat-container").style.display = 'flex';
    document.getElementById("nombreUser").innerHTML = nombreReceptor;
    document.getElementById('chat-footer').innerHTML = `
            <input type="text" placeholder="Escribe un mensaje..." id="mensaje" autocomplete="off" autofocus />
        <button type="button" onclick="enviarMensaje('${data}')">Enviar</button>
   
    `


    document.getElementById('mensajesList').innerHTML = ""
    notification.forEach(nt => {
        document.getElementById('mensajesList').innerHTML += `
         <a class="dropdown-item d-flex align-items-center" href="#" onclick="abrirChat('${nt._id}')">
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
    if (window.innerWidth <= 768) {
        document.body.style.overflow = 'hidden';
      }
   
    mantenerContenedorAbajo()
})

function cerrarChat() {
    document.getElementById("chat-container").style.display = 'none';
    if (window.innerWidth <= 768) {
        document.body.style.overflow = 'auto';
      }

}


function activarMensaje(){
    if (window.innerWidth <= 768) {
        document.getElementById('chatbody').classList.add('chat-bodyAgregado');

      }
}





socket.on('server:mensaje', (data, cantidad, notification, idChat, idUser) => {
    const iduserEmisor = data.userEmisor;
    const iduserReceptor = data.userReceptor;

    document.getElementById('cuerpomensaje' + userLocal).innerHTML = ""
    data.mensajes.forEach(ms => {
        document.getElementById('cuerpomensaje' + userLocal).innerHTML += `
            <div class="usuario ${ms.userEmisor === userLocal ? 'msgEmisor' : 'msgReceptor'}">
              <span class="nombre-usuario texto">${ms.mensaje}</span>
              <small class="text-gray-500 horaMensaje">${ms.hora}</small>
          </div>
            `
    })

    document.getElementById('mensajesList').innerHTML = ""

    for (let i = 0; i < notification.length; i++) {
        const idUser = notification[i].idUser
        const userReceptor = notification[i].userReceptor

        if (idUser === userLocal || userReceptor === userLocal) {
            document.getElementById('mensajesList').innerHTML += `
                <a class="dropdown-item d-flex align-items-center" href="#" onclick="abrirChat('${notification[i].idConversacion}')">
                                       <div class="dropdown-list-image mr-3">
                                           <img class="rounded-circle" src="${notification[i].photo}" alt="..." style="height: 35px;width:35px">
                         
                                   </div>
                                      <div class="font-weight-bold">
                                          <div class="text-truncate">${notification[i].idUser === userLocal ? notification[i].nombreUserReceptor : notification[i].nombreUserEmisor}</div>
                                           <div class="small text-gray-500">${notification[i].ultimoId === userLocal ? 'Tu: ' : ''} ${notification[i].mensaje}</div>
                                     </div>
                                 </a>
       
            `
        }


    }
    // notification.forEach(nt => {
    //     if (idUser === nt.idUser || idUser === nt.userReceptor) {
    //         document.getElementById('mensajesList').innerHTML += `
    //             <a class="dropdown-item d-flex align-items-center" href="#" onclick="abrirChat('${nt.idConversacion}')">
    //                                    <div class="dropdown-list-image mr-3">
    //                                        <img class="rounded-circle" src="${nt.photo}" alt="..." style="height: 35px;width:35px">
    //                                        <div class="status-indicator bg-success"></div>
    //                                    </div>
    //                                    <div class="font-weight-bold">
    //                                        <div class="text-truncate">${nt.idUser === userLocal ? nt.nombreUserReceptor : nt.nombreUserEmisor}</div>
    //                                         <div class="small text-gray-500">${nt.ultimoId === userLocal ? 'Tu: ' : ''} ${nt.mensaje}</div>
    //                                    </div>
    //                                </a>

    //            `
    //     }
    //     // else {
    //     //     console.log('recibido2')
    //     //      document.getElementById('mensajesList').innerHTML = `
    //     //      <p>No tienes mensajes</p>
    //     //      `

    //     // }

    // })


    // document.getElementById('contador').innerHTML = cantidad
    mantenerContenedorAbajo()
})

function mantenerContenedorAbajo() {
    chatbody.scrollTop = chatbody.scrollHeight;
}