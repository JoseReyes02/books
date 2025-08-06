document.getElementById('formLogin').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form); // recoge todos los campos, incluyendo la imagen

  try {
    const res = await fetch('/users/signin', {
      method: 'POST',
      body: formData // No pongas headers, fetch los gestiona automáticamente
    });

    const data = await res.json();
    console.log('Respuesta:', data);
  } catch (error) {
    console.error('Error al enviar:', error);
  }
});
