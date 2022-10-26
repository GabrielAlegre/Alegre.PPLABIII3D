import { verificarQueCampoNoEsteVacio, verificarQueSeanTodoNumerosEnterosPositivos, verificarQueSeanUnPrecioValido, validarSubmit, verificarQueNoExcedaCaracteres} from "./validaciones.js";
import AnuncioMascota from "./anuncioMascota.js";
import { crearTablaDinamica } from "./tablaDinamica.js";

const $formulario = document.forms[0];
const controles = $formulario.elements;
const $divTabla = document.getElementById("divTabla");
const anuncios = JSON.parse(localStorage.getItem("listaAnimales")) || [];

actualizarTabla();

$formulario.addEventListener("submit", (e)=>{
    e.preventDefault();

    if(!validarSubmit(controles))
    {
        return null;
    }

    realizarOperacion();
});

document.addEventListener("click", (e)=>{
    const emisorDelEvento = e.target;

    if(emisorDelEvento.matches("td"))
    {
        let idDelObjetoSeleccionado = emisorDelEvento.parentElement.dataset.id;
        const objetoRecuperado = anuncios.find((objeto)=>objeto.id==idDelObjetoSeleccionado)
        
        cargarFormularioConDatos(objetoRecuperado);
    }
    else if(emisorDelEvento.matches("#btnEliminar"))
    {
        let idDelAnuncioQueSeEliminara=parseInt($formulario.txtId.value);

        agregarSpinner();
        setTimeout(()=>{
            handlerEliminar(idDelAnuncioQueSeEliminara);
            eliminarSpinner();
        },3000)
        limpiarFormulario($formulario);
    }
    else if(emisorDelEvento.matches("#btnCancelar"))
    {
        limpiarFormulario($formulario);
    }
});

for (const control of controles) {

    if(control.matches("input") && control.matches("[type=number]") || control.matches("[type=text]"))
    {
        control.addEventListener("blur", verificarQueCampoNoEsteVacio);

        if(control.matches("[type=number]") && control.name == "Precio")
        {
            control.addEventListener("blur", verificarQueSeanUnPrecioValido) ;
        }
        else if(control.matches("[type=number]"))
        {
            control.addEventListener("blur", verificarQueSeanTodoNumerosEnterosPositivos);
        }
        else if(control.matches("[type=text]") && control.name == "Titulo" || control.matches("[type=text]") && control.name == "Descripcion")
        {
            control.addEventListener("blur", verificarQueNoExcedaCaracteres);
        }
    }
}

const actualizarStorage = (anuncios) =>{
    localStorage.setItem("listaAnimales", JSON.stringify(anuncios));
}

function actualizarTabla(){
    borrarTabla();
    const lista = JSON.parse(localStorage.getItem("listaAnimales"));
    if(lista){
        lista.sort((a,b)=>{
            return a.precio-b.precio;
        })
        $divTabla.appendChild(crearTablaDinamica(lista));
    }
}

const handlerAlta = (objetoQueSeDaraDeAlta)=>{
    anuncios.push(objetoQueSeDaraDeAlta);
    actualizarStorage(anuncios);
    actualizarTabla();
}


const handlerModificar = (objetoQueSeModificara)=>{
    let indice = anuncios.findIndex((anuncio)=>anuncio.id == objetoQueSeModificara.id); 

    anuncios.splice(indice, 1);
    anuncios.push(objetoQueSeModificara);

    actualizarStorage(anuncios);
    actualizarTabla();
}


const handlerEliminar = (id)=>{
    let indice = anuncios.findIndex((anuncio) => anuncio.id == id); 

    anuncios.splice(indice, 1);

    actualizarStorage(anuncios);
    actualizarTabla();
}

function realizarOperacion()
{
    const {txtTitulo, txtDescripcion, rdoAnimal, txtPrecio, txtRaza, txtFechaNacimiento, selectVacuna, txtId} = $formulario;

    const anuncio = new AnuncioMascota(
        txtId.value,
        txtTitulo.value, 
        rdoAnimal.value, 
        txtDescripcion.value, 
        txtPrecio.value, 
        txtRaza.value, 
        txtFechaNacimiento.value,
        selectVacuna.value);

    if(anuncio.id === ''){
        agregarSpinner();
        setTimeout(()=>{
            anuncio.id=Date.now();
            handlerAlta(anuncio);
            eliminarSpinner();
        }, 3000)
    }
    else{
        agregarSpinner();
        setTimeout(()=>{
            handlerModificar(anuncio);
            eliminarSpinner();
        },3000)
    }

    limpiarFormulario($formulario);

    console.log("enviando...");
}

function limpiarFormulario(frm){
    frm.reset();
    document.getElementById("btnEliminar").classList.add("oculto");
    document.getElementById("btnCancelar").classList.add("oculto");
    document.getElementById("btnSubmit").value = "Guardar";
    $formulario.txtId.value = "" ;
}

function borrarTabla()
{
    while($divTabla.hasChildNodes())
    {
        $divTabla.removeChild($divTabla.firstElementChild)
    }
}

function cargarFormularioConDatos(anuncio)
{
    const {txtTitulo, txtDescripcion, rdoAnimal, txtPrecio, txtRaza, txtFechaNacimiento, selectVacuna, txtId} = $formulario;

    txtId.value=anuncio.id;
    txtTitulo.value=anuncio.titulo;
    rdoAnimal.value=anuncio.animal;
    txtDescripcion.value=anuncio.descripcion;
    txtPrecio.value=anuncio.precio;
    txtRaza.value=anuncio.raza;
    txtFechaNacimiento.value=anuncio.fechaNacimiento;
    selectVacuna.value=anuncio.vacuna;

    document.getElementById("btnSubmit").value = "Modificar";
    document.getElementById("btnEliminar").classList.remove("oculto");
    document.getElementById("btnCancelar").classList.remove("oculto");
}

function agregarSpinner(){
    let spinner = document.createElement("img");
    spinner.setAttribute("src","./img/spinner.webp");
    spinner.setAttribute("alt","Imagen spinner");
    document.getElementById("divSpinner").appendChild(spinner);
}

function eliminarSpinner(){
    document.getElementById("divSpinner").innerHTML="";
}