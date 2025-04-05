let indice = 0;
const totalSlides = document.querySelectorAll(".slide").length;
const slidesVisibles = 4;
const slider = document.querySelector(".slider");

function moverSlide(direccion) {
  const maxIndex = totalSlides - slidesVisibles;
  indice += direccion;

  if (indice < 0) indice = 0;
  if (indice > maxIndex) indice = maxIndex;

  slider.style.transform = `translateX(-${indice * 25}%)`;
}