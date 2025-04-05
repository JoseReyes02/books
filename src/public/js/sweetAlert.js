// localStorage.removeItem('miValorGuardado');
function validarInputs(){
   var titulo =  document.getElementById('titulo')
   var precio =  document.getElementById('precio')
    var boton = document.getElementById('btnEnviardatos');
   if(titulo.value.trim() === ''){
    setTimeout(function() {
        Swal.fire({
               title: "Warning!",
               text: "El campo TITULO está vacío",
               icon: 'warning',
           });  
       }, 100);
   }
   else if(precio.value.trim() === ''){
    setTimeout(function() {
        Swal.fire({
               title: "Warning!",
               text: "El campo PRECIO está vacío", 
               icon: 'warning',
           });  
       }, 100);
   }else{
    setTimeout(function() {
        Swal.fire({
               title: "Bien!",
               text: "Registro guardado satifatoriamente.",
               icon: 'success',
           }).then((result) => {
            if (result.isConfirmed) {
                // recet()
                var valor = 'success';
                document.getElementById('valorSuccess').value = valor;
                boton.click();
                // localStorage.removeItem('miValorGuardado');
                location.href = '/';
                // Puedes llamar a una función o redirigir a otra página, según tus necesidades
            }
        });
       }, 100);

   }
}
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
    location.reload();
}


