document.addEventListener('DOMContentLoaded', function () {
    const passwordInput = document.getElementById('password');
    const togglePasswordButton = document.getElementById('togglePassword');

    togglePasswordButton.addEventListener('click', function () {
      // Alterna el atributo 'type' del input entre 'password' y 'text'
      passwordInput.type = (passwordInput.type === 'password') ? 'text' : 'password';

      // Cambia el texto del botón
      // togglePasswordButton.textContent = (passwordInput.type === 'password') ? 'Mostrar Contraseña' : 'Ocultar Contraseña';
    });
  });

  