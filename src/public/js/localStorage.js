// Recuperar el valor de localStorage
// Obtener una referencia al elemento de entrada
var titulo = document.getElementById('titulo');
var inmueble = document.getElementById('inmueble');
var precio = document.getElementById('precio');
var restron = document.getElementById('restron');
var habitaciones = document.getElementById('habitaciones');
var marquesinas = document.getElementById('marquesinas');
var pais = document.getElementById('pais');
var provincia = document.getElementById('provincia');
var municipio = document.getElementById('municipio');
var descripcion = document.getElementById('descripcion');
// var numPublicacion = document.getElementById('numPublicacion');


// Escuchar el evento input y guardar el valor en localStorag
titulo.addEventListener('input', function () {
    localStorage.setItem('inputValue1', titulo.value);
});

inmueble.addEventListener('input', function () {
    localStorage.setItem('inputValue2', inmueble.value);
});

precio.addEventListener('input', function () {
    localStorage.setItem('inputValue3', precio.value);
});
restron.addEventListener('input', function () {
    localStorage.setItem('inputValue4', restron.value);
});
habitaciones.addEventListener('input', function () {
    localStorage.setItem('inputValue5', habitaciones.value);
});
marquesinas.addEventListener('input', function () {
    localStorage.setItem('inputValue6', marquesinas.value);
});
pais.addEventListener('input', function () {
    localStorage.setItem('inputValue7', pais.value);
});
provincia.addEventListener('input', function () {
    localStorage.setItem('inputValue8', provincia.value);
});
municipio.addEventListener('input', function () {
    localStorage.setItem('inputValue9', municipio.value);
});
descripcion.addEventListener('input', function () {
    localStorage.setItem('inputValue10', descripcion.value);
});
// numPublicacion.addEventListener('input', function () {
//     localStorage.setItem('inputValue11', numPublicacion.value);
// });

// recuperar el valor de local strategi
document.addEventListener('DOMContentLoaded', function () {
    var titulo = document.getElementById('titulo');
    var inmueble = document.getElementById('inmueble');
    var precio = document.getElementById('precio');
    var restron = document.getElementById('restron');
    var habitaciones = document.getElementById('habitaciones');
    var marquesinas = document.getElementById('marquesinas');
    var pais = document.getElementById('pais');
    var provincia = document.getElementById('provincia');
    var municipio = document.getElementById('municipio');
    var descripcion = document.getElementById('descripcion');
    // var numPublicacion = document.getElementById('numPublicacion');

    var savedValue1 = localStorage.getItem('inputValue1');
    var savedValue2 = localStorage.getItem('inputValue2');
    var savedValue3 = localStorage.getItem('inputValue3');
    var savedValue4 = localStorage.getItem('inputValue4');
    var savedValue5 = localStorage.getItem('inputValue5');
    var savedValue6 = localStorage.getItem('inputValue6');
    var savedValue7 = localStorage.getItem('inputValue7');
    var savedValue8 = localStorage.getItem('inputValue8');
    var savedValue9 = localStorage.getItem('inputValue9');
    var savedValue10 = localStorage.getItem('inputValue10');
    // var savedValue11 = localStorage.getItem('inputValue11');


    if (savedValue1) {
        titulo.value = savedValue1;
    }
    if (savedValue2) {
        inmueble.value = savedValue2;
    }
    if (savedValue3) {
        precio.value = savedValue3;
    }
    if (savedValue4) {
        restron.value = savedValue4;
    }
    if (savedValue5) {
        habitaciones.value = savedValue5;
    }
    if (savedValue6) {
        marquesinas.value = savedValue6;
    }
    if (savedValue7) {
        pais.value = savedValue7;
    }
    if (savedValue8) {
        provincia.value = savedValue8;
    }
    if (savedValue9) {
        municipio.value = savedValue9;
    }
    if (savedValue10) {
        descripcion.value = savedValue10;
    }
    // if (savedValue11) {
    //     numPublicacion.value = savedValue11;
    // }
});


function recet(){
     localStorage.removeItem('inputValue1');
     localStorage.removeItem('inputValue2');
     localStorage.removeItem('inputValue3');
     localStorage.removeItem('inputValue4');
     localStorage.removeItem('inputValue5');
     localStorage.removeItem('inputValue6');
     localStorage.removeItem('inputValue7');
     localStorage.removeItem('inputValue8');
     localStorage.removeItem('inputValue9');
     localStorage.removeItem('inputValue10');
     localStorage.removeItem('inputValue11');
    //  localStorage.removeItem('miValorGuardado');
     location.reload();
}

//  para remover los valores
// localStorage.removeItem('inputValue');


