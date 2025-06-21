if (window.location.href === 'http://localhost:2000/admin' || (window.location.href === 'http://10.0.0.21:2000/admin')) {
    window.addEventListener('load', function () {
        const { value: formValues } = Swal.fire({
            title: 'Ingresa como Administrador',
            // footer: '<div class="alert alert-danger" role="alert">Mensaje de error</div>',
            backdrop: false,
            allowOutsedeClick: false,
            html:
                '<p style="text-align: left;">Email</p>' +
                '<input type="text" id="swal-input1" class="form-control" autocomplete="off">' +
                '<p style="margin-top: 10px;text-align: left;">Contraseña</p>' +
                '<input type="password" id="swal-input2" class="form-control" style="margin-top: 10px;">',

            focusConfirm: false,
            preConfirm: () => {
                if (document.getElementById('swal-input1').value == '') {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Campo Usuario requerido',
                        // showDenyButton: true,
                        showCancelButton: true,
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                            location.reload()
                        } else {
                            this.location.href = '/'
                        }
                    })
                }

                else if (document.getElementById('swal-input2').value == '') {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Campo contraseña requerido',
                        // showDenyButton: true,
                        showCancelButton: true,
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                            location.reload();
                        } else {
                            this.location.href = '/'
                        }
                    })
                } else {
                    document.getElementById('usuario').value =
                        document.getElementById('swal-input1').value;
                    document.getElementById('password').value =
                        document.getElementById('swal-input2').value;
                    var boton = document.getElementById('enviarDatosAdmin')
                    boton.click();

                }


            }
        })

        if (formValues) {
            Swal.fire(JSON.stringify(formValues))


        }

    });
}

const valorRecuperado = localStorage.getItem("miValorGuardado");
const valorRecuperado2 = localStorage.getItem("miValorGuardado2");
// Verificar si se recuperó un valor
if (valorRecuperado !== null) {
    // Utiliza el valor como sea necesario 
    document.getElementById('numPublicacion').value = valorRecuperado;
} else {
    //   alert('el valor no existe')
}
if (valorRecuperado2 !== null) {
    // Utiliza el valor como sea necesario 
    document.getElementById('idPublicacion').value = valorRecuperado2;
} else {
    //   alert('el valor no existe')
}
function eliminarinput() {
    localStorage.removeItem('miValorGuardado');
    localStorage.removeItem('miValorGuardado2');
    location.reload();

}
var swiper = new Swiper(".slide-content", {
    slidesPerView: 3,
    spaceBetween: 25,
    loop: true,
    centerSlide: 'true',
    fade: 'true',
    grabCursor: 'true',
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },

    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        520: {
            slidesPerView: 2,
        },
        950: {
            slidesPerView: 3,
        },
    },
});

function tomarIdImagen(imagenId) {
    Swal.fire({
        title: "Colocar Imagen en el carrousel principal?",
        showDenyButton: true,
        // showCancelButton: true,
        confirmButtonText: "Save",

    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            Swal.fire("Saved!", "", "success");
            document.getElementById('idImagen').value = imagenId;
            var boton = document.getElementById('btn-guardarImagenCarrousel');
            setTimeout(function () { boton.click(); }, 150);

        } else if (result.isDenied) {
            Swal.fire("Cancelado", "", "info");
        }
    });
}

// CODIGO PARA MOSTRAR EL MODAL DE CARGAR LA IMAGEN

const inputImagen = document.getElementById("input-imagen");
const modal = document.getElementById("mi-modal");
const imagenModal = document.getElementById("imagen-modal");
const abrirModal = document.getElementById("abrir-modal");
const cerrarModal = document.getElementById("cerrar-modal");

// Abrir el modal al hacer clic en el botón "Abrir Modal"
abrirModal.addEventListener("click", function () {
    modal.style.display = "block";
});

// Cerrar el modal al hacer clic en el botón de cierre
cerrarModal.addEventListener("click", function () {
    modal.style.display = "none";
});

// Cargar la imagen seleccionada en el modal
// inputImagen.addEventListener("change", function () {
//     const archivo = inputImagen.files[0];

//     if (archivo) {
//         const lector = new FileReader();

//         lector.onload = function (e) {
//             imagenModal.src = e.target.result;
//             document.getElementById('btn-cargarfoto').click()
//             document.getElementById('loader').style.display = 'flex';
//             // modal.style.display = "block"; // Abre el modal cuando se carga la imagen
//         };

//         lector.readAsDataURL(archivo);
//     }
// });


const input = document.getElementById('input-imagen');
const preview = document.getElementById('previewImagenes');

input.addEventListener('change', function () {
    preview.innerHTML = ''; // Limpiar vista previa anterior

    const archivos = Array.from(this.files);

    archivos.forEach((archivo) => {
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.width = '120px';
            img.style.height = '100px';
            img.style.objectFit = 'cover';
            img.style.margin = '5px';
            img.style.borderRadius = '8px';
            img.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            // preview.appendChild(img);
        };
        // document.getElementById('selectedImAGEN').style.display = 'none'

        reader.readAsDataURL(archivo);
    });
    document.getElementById('loader').style.display = 'flex';
    document.getElementById('btnSubir').click()
});










document.getElementById("miFormulario").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita la recarga de la página por defecto al enviar el formulario
    const formData = new FormData(this); // Obtiene los datos del formulario
    const url = "/publicar"; // Reemplaza con la URL de tu servidor

    fetch(url, {
        method: "POST", // Puedes usar POST u otro método según tu servidor
        body: formData
    })
        .then(response => response.json()) // Parsea la respuesta JSON
        .then(data => {
            const miValorDesdeServidor = data.numPublicacion;
            const miValorDesdeServidor2 = data.idPublicacion;
            localStorage.setItem("miValorGuardado", miValorDesdeServidor);
            localStorage.setItem("miValorGuardado2", miValorDesdeServidor2);
            location.reload();
            // document.getElementById('numPublicacion').value = data.mensaje;
        })
        .catch(error => {
            console.error("Error:", error);
        });
});

function copiarEnlace(id) {
    // Obtiene el valor actual del input
    const enlaceBase = document.getElementById('enlace').value;

    // Concatena el valor del ID
    const enlaceCompleto = enlaceBase + '/' + id;

    // Crea un elemento temporal de textarea para copiar el enlace
    const textarea = document.createElement('textarea');
    textarea.value = enlaceCompleto;

    // Agrega el textarea al documento
    document.body.appendChild(textarea);

    // Selecciona y copia el texto en el textarea
    textarea.select();
    document.execCommand('copy');

    // Elimina el textarea temporal
    document.body.removeChild(textarea);

    // Muestra un mensaje de éxito
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: 'success',
        title: 'Enlace copiado al portapapeles..'
    })
}

// ENVIAR FORMULARIO PARA DAR LIKE


function eliminarImagen(id) {
    document.getElementById('idImagen').value = id;
    $("#btnIdImagen").click();
}
function fspublicar() {
    location.href = '/publicar'
}
function mispublicaciones() {
    location.href = '/publicaciones/misPublicaciones'
}
function quemegustan() {
    location.href = '/publicaciones/megustan'
}

function facebook() {

    window.open('https://www.facebook.com/joseeladio.reyes/');

}

function perfil() {
    location.href = '/users/perfil';
}
function inputFileFuncion() {
    var boton = document.getElementById('inputFile');
    boton.click()
}









