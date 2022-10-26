import crearCarta from "./articuloDinamico.js";

const anuncios = JSON.parse(localStorage.getItem("listaAnimales")) || [];
const $sectionAnuncios = document.getElementById("anunciosMascotas");

console.log(anuncios);
console.log($sectionAnuncios);

anuncios.forEach(element => {
    $sectionAnuncios.appendChild(crearCarta(element));
});