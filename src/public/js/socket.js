// oOPTENER EL NOMBRE DE LA IMAGEN SELECIONADA
const socket = io();

const imageInput = document.getElementById("input-imagen");
const fileNameDisplay = document.getElementById("fileName");

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0]; // Obtiene el primer archivo seleccionado
  if (file) {
    document.getElementById('fileName').value = file.name

  } else {
    fileNameDisplay.textContent = "No se seleccionó ningún archivo.";
  }
});


function enviarImagen() {
  const nombreImagen = document.getElementById('fileName').value;
  const idPublicacion = document.getElementById('idPublicacion').value
  socket.emit('client:cargarImagen', {
    nombreImagen: nombreImagen,
    idPublicacion: idPublicacion
  });
}
function enviarFotoIdUser(idUsuario, imagenName) {
  socket.emit('client:changeImageProfile', {
    nombreImagen: imagenName,
    idPublicacion: idUsuario
  });
}


function GuardarPublicacion() {
  const seleccion = document.querySelector('input[name="flexRadioDefault"]:checked').value;

  const titulo = document.getElementById('titulo').value;
  const tipoPropiedad = document.getElementById('tipoPropiedad').value;
  const metros = document.getElementById('metros').value;
  const restron = document.getElementById('restron').value
  const habitaciones = document.getElementById('habitaciones').value
  const marquesinas = document.getElementById('marquesinas').value
  const moneda = document.getElementById('moneda').value
  const disponibilidad = document.getElementById('disponibilidad').value
  var precio = document.getElementById('precio').value

  const pais = document.getElementById('pais').value
  const provincia = document.getElementById('provincia').value
  const municipio = document.getElementById('municipio').value
  const direccion = document.getElementById('direccion').value
  const descripcion = document.getElementById('descripcion').value
  const idPublicacion = document.getElementById('idPublicacion').value
  const nombre = document.getElementById('nombre').value
  const email = document.getElementById('email').value
  const ubicacion = document.getElementById('ubicacion').value
  const telefono = document.getElementById('telefono').value
  precio = parseFloat(precio)
  const precioo = precio.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  console.log(precioo)
  socket.emit('client:guardarPublicacion', {
    titulo: titulo,
    tipoPropiedad: tipoPropiedad,
    restron: restron,
    habitaciones: habitaciones,
    marquesinas: marquesinas,
    moneda: moneda,
    disponibilidad: disponibilidad,
    precio: precioo,
    pais: pais,
    provincia: provincia,
    municipio: municipio,
    direccion: direccion,
    descripcion: descripcion,
    idPublicacion: idPublicacion,
    tipo_operacion: seleccion,
    nombre: nombre,
    metros: metros,
    ubicacion: ubicacion,

    telefono: telefono,
    email: email

  });
}
function ActualizarPublicacion() {
  const seleccion = document.querySelector('input[name="flexRadioDefault"]:checked').value;
  const titulo = document.getElementById('titulo').value;
  const tipoPropiedad = document.getElementById('tipoPropiedad').value;
  const restron = document.getElementById('restron').value
  const habitaciones = document.getElementById('habitaciones').value
  const marquesinas = document.getElementById('marquesinas').value
  const moneda = document.getElementById('moneda').value
  const disponibilidad = document.getElementById('disponibilidad').value
  const precio = document.getElementById('precio').value
  const pais = document.getElementById('pais').value
  const provincia = document.getElementById('provincia').value
  const municipio = document.getElementById('municipio').value
  const direccion = document.getElementById('direccion').value
  const descripcion = document.getElementById('descripcion').value
  const idPublicacion = document.getElementById('idPublicacion').value
  const nombre = document.getElementById('nombre').value
  const email = document.getElementById('email').value
  const telefono = document.getElementById('telefono').value
  const ubicacion = document.getElementById('ubicacion').value
  socket.emit('client:ActualizarPublicacion', {
    titulo: titulo,
    tipoPropiedad: tipoPropiedad,
    restron: restron,
    habitaciones: habitaciones,
    marquesinas: marquesinas,
    moneda: moneda,
    disponibilidad: disponibilidad,
    precio: precio,
    pais: pais,
    provincia: provincia,
    municipio: municipio,
    direccion: direccion,
    descripcion: descripcion,
    idPublicacion: idPublicacion,
    tipo_operacion: seleccion,
    nombre: nombre,
    email: email,
    ubicacion: ubicacion,

    telefono: telefono

  });
}

function quitarImage(id) {
  const idPublicacion = document.getElementById('idPublicacion').value;
  socket.emit('client:quitarImagen', {
    idPublicacion: idPublicacion,
    idImagen: id
  });
  document.getElementById('imageModal').style.display = 'none'
}




//MOSTRAR IMAGENES A LA PAGINA
socket.on('server:mostrarFotos', (data) => {
  document.getElementById('showImagen1').style.display = 'none'
  document.getElementById('showImagen2').style.display = 'block'
  document.getElementById('showImagen2').innerHTML = ''
  data.forEach(fotos => {
    document.getElementById('showImagen2').innerHTML += `
         <img src="${fotos.urlImagen}" alt="Cinque Terre" class="aumentar" onclick="thumbnail('${fotos.idImagen}')">
    `
  });
})


function thumbnail(id) {
  Swal.fire({
    title: "Quieres quitar esta imagen?",
    showCancelButton: true,
    confirmButtonText: "Si!",
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      const idPublicacion = document.getElementById('idPublicacion').value
      socket.emit('client:abrirImagen', {
        idImagen: id,
        idPublicacion: idPublicacion
      });
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });

}

function deleted(id) {
  Swal.fire({
    title: "Quieres marcar como No disponible?",
    showCancelButton: true,
    confirmButtonText: "Si!",
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      Swal.fire("Saved!", "", "success").then(() => {
        socket.emit('client:quitarPublicacion', {
          id: id
        })
      });
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });
}

//MOSTRAR IMAGENES en el modal

socket.on('server:abrirImagen', (data, id) => {
  document.getElementById('imageModal').style.display = "block";
  document.getElementById('imagenMostrar').innerHTML = `
   <img id="modalImage" src="/upload/${data}" alt="Imagen Grande" class="img-carousel" style="width: 100%; height: 500px;">
  `
  document.getElementById('quitarImagen').innerHTML = `
     <button type="button" class="delete btn btn-danger" onclick="quitarImage('${id}')">Eliminar foto</button>
  `


})

function enviarDatoLike(data, id) {
  socket.emit('client:like', {
    idUser: data,
    idPublicacion: id
  })
}


function filtrarInmueble() {
  const provincia = document.getElementById('provincia').value
  const municipio = document.getElementById('municipio').value
  const tipo_inmueble = document.getElementById('tipo_inmueble').value
  socket.emit('client:filtrarInmueble', {
    provincia: provincia,
    municipio: municipio,
    tipo_inmueble: tipo_inmueble
  })
}


function quitarPublicacion(idPublicacion, idUser) {
  socket.emit('client:quitarGuardado', {
    idPublicacion: idPublicacion,
    idUser: idUser
  })
}


