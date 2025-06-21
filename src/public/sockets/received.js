//Despues que se quita una publicacion
socket.on('server:quitarPublicacion', (data) => {
  location.reload()
})



socket.on('server:error', (data) => {
  document.getElementById('contenidoError').innerHTML = `
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
    <strong>Warning!</strong> ${data}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
    `
})

//PUBLICACION GUARDADA
socket.on('server:publicacionGuardada', (data) => {
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Publicacion guardada!",
    showConfirmButton: false,
    timer: 1500
  }).then(() => {
    window.location.href = '/'
  });
  // location.reload() 
})

//PUBLICACION GUARDADA
socket.on('server:ponerMeGusta', (data, likes, publicacion) => {
  document.getElementById('likeCount' + data).innerHTML = `
                 
                    <span><i class="bi-heart-fill" style="color: #13df00"></i> ${publicacion.likeCount}</span>
              
                      
    `
})

//QUITAR MEGUSTA
socket.on('server:quitarMeGusta', (data, likes, publicacion) => {

  document.getElementById('likeCount' + data).innerHTML = `
                 
                    <span><i class="bi-heart-fill"  style="color: #f1f1f1"></i> ${publicacion.likeCount}</span>
              
                      
    `

})





socket.on('server:filtrarInmueble', (data) => {
  const modalBusqueda = document.getElementById('abrirModalBusqueda')
  modalBusqueda.click()
  data.forEach(public => {

    let fotosHTML = "";
    let indicadoresHTML = "";
    let haDadoMeGusta = public.haDadoMeGusta ? "color: #13df00" : "color: #f1f1f1";
    let textoMeGusta = public.haDadoMeGusta ? "Guardado" : "Me gusta";

    // Generar indicadores y fotos para el carrusel
    public.fotos.forEach((foto, index) => {
      indicadoresHTML += `
        <li data-target="#carousel${public._id}" data-slide-to="${index}" ${index === 0 ? 'class="active"' : ''}></li>
      `;

      fotosHTML += `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
          <img src="${foto.urlImagen}" alt="Imagen ${index}" style="width: 100%; height: 200px;">
        </div>
      `;
    });

    // Estructura del HTML generado dinámicamente
    let contenidoHTML = `
      <div class="package-item bg-white mb-2">
        <div class="post-header">
          <img src="${public.photo}" alt="Profile" class="profile-pic">
          <div class="user-info">
            <div class="name">${public.usuario}</div>
            <div class="timestamp">${public.fecha} a las ${public.hora}</div>
          </div>
        </div>

        <div id="carousel${public._id}" class="carousel slide" data-ride="carousel">
          <ol class="carousel-indicators">${indicadoresHTML}</ol>
          <div class="carousel-inner">${fotosHTML}</div>
          <a class="carousel-control-prev" href="#carousel${public._id}" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
          </a>
          <a class="carousel-control-next" href="#carousel${public._id}" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
          </a>
        </div>

        <div class="p-2">
          <div class="d-flex justify-content-between">
            <h5 class="m-0">${public.moneda} ${public.precio}</h5>
          </div>
        </div>

        <div class="p-1">
          <div class="d-flex justify-content-between mb-3">
            <small class="m-0"><i class="bi bi-house-door-fill text-primary mr-2"></i>${public.habitaciones} Habitaciones</small>
            <small class="m-0"><i class="fa fa-bath text-primary mr-2"></i>${public.restron} Baños</small>
            <small class="m-0"><i class="fa fa-truck text-primary mr-2"></i>${public.marquesinas} Parqueos</small>
          </div>
          <div class="localidades">
            <small class="m-0">${public.provincia}</small>
          </div>
          <hr>
          <div class="mt-1 pt-1">
            <div class="post-footer d-flex align-items-center" id="containerLike${public._id}">
              <a href="/vistaSeleccionado/${public._id}" class="btn btn-primary btn-sm">
                <i class="bi bi-list-columns-reverse"></i> Detalles
              </a>
             
             
            </div>
          </div>
        </div>
      </div>
    `;

    // Insertar en el contenedor correspondiente

    document.getElementById('publicaciones' + public._id).innerHTML = contenidoHTML;
  });
});


socket.on('server:filtrarInmuebleError', (data) => {
  alert('No existen datos')
  document.getElementById('limpiarTodo').innerHTML = `
  
  `

})


socket.on('server:quitarGuardado', (idPublicacion) => {
  document.getElementById('publicacionesGuardadas' + idPublicacion).innerHTML = '';
  alertify.success('Publicacion quitada!');
});

