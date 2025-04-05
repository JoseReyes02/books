

function login(){
    setTimeout( function () { 
            
        window.location.href = "login.html"; }, 500 );
}
function enviar(){
    const passwor = document.getElementById("password").value;
    
        if(passwor.length < 8){
            document.write('no');
       
        }else{
                document.write('si');
            
        }
        if(passwor == ''){
            document.write("el campo contraseña esta en blanco");

        }else{
            document.write("completado!");
        }
    
   
}