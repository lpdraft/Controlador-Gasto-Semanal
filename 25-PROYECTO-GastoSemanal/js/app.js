//Variables y Selctores Globales
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');



//Eventos (Cuando demos el click o cuando el documento esté listo)
eventListeneres();
function eventListeneres() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}



//Clases(normalmente las clases están reservadas para Objetos)
class Presupuesto {
    constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);//Ponemos Number() ya que aun no sabemos la entrada de Datos
    this.restante = Number(presupuesto);//Cuando instanciamos el presupuesto el 'Restante' es el mismo ya que no hemos definido el Gasto todavía
    this.gastos  = [];//Cuando instanciamos el presupuesto el 'Restante' es el mismo ya que no hemos definido el Gasto todavía
    }

    nuevoGasto(gasto){
        this.gastos  = [...this.gastos, gasto];
        this.calcularRestante();
    }
    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto)=> total + gasto.cantidad, 0);
        this.restante = this.presupuesto  - gastado;
    }
    
    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        //1er. Extraemos los valores
        const {presupuesto, restante} = cantidad;//Es un objeto que ya se definió abajo

        //2nd. Los agregalos al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = presupuesto;
    }
    imprimirAlerta(mensaje, tipo)  {
        //Crear el div
        const divMensaje  = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        }else {
            divMensaje.classList.add('alert-success');
        }

        //Ahora asignar el  mensaje
        divMensaje.textContent  = mensaje;

        //Insetar en  el Html
        document.querySelector('.primario').insertBefore(divMensaje, formulario);//En la seccion  primario (formulario), se añade la alerta

        //Quitar del html ese mensaje del error
        setTimeout(()=> {
            divMensaje.remove();
        }, 3000);
    }

    mostrarGastos(gastos) {
        //Limpia el html previo
        this.limpiarHtml();

        //Iterar sobre los gastos
        gastos.forEach( gasto => {  

            const {cantidad, nombre, id } = gasto;

            //Crear un (li)
                const nuevoGasto = document.createElement('li');
                nuevoGasto.className = 'list-group-item d-flex  justify-content-between align-items-center';
               //nuevoGasto.setAttribute('data-id', id);  Versiones previas de ejecución

               nuevoGasto.dataset.id = id;//Verion actual

            //Agregar en el  html del  gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> ${cantidad}</span>
            `;
            //Boton para borrar  el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn','btn-danger','borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times;'
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //Agregar al html
            gastoListado.appendChild(nuevoGasto);

        })
    }
    limpiarHtml(){
    while (gastoListado.firstChild){
        gastoListado.removeChild(gastoListado.firstChild);//Si ya hay un dato, se  emlimina ese dato  previo
         }
    }      
    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');

        //Comprobar el 25% del presupuesto
        if ((presupuesto / 4)> restante) {//Si el restante es mayor a 25, pues ej. 100/4 es 25, ya gasté el 75%  del presu
          restanteDiv.classList.remove('alert-success', 'alert-warning');
          restanteDiv.classList.add('alert-danger');
        } else if ((presupuesto / 2)> restante){
            restanteDiv.classList.remove('alert-success');
          restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger','alert-warning');
            restanteDiv.classList.add('alert-success');
        }


        //Si el total es 0 o menor
        if (restante <= 0) {
            ui.imprimirAlerta('No dispones de fondos suficientes', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}



//Instancias Globales
const ui = new UI();
let presupuesto;//Empieza sin valor, pero una vez que un usuario mete un dato toma ese valor ('Presupuesto válido)

// Necesitamos 2 clases principales
/*
1. Presupuesto: Una clase que controle el presupuesto actual y Restante
2. InterfaceUsuario: Clase visualizador Html Gastos y Validaciones (al dar a 'Agregar')
*/


//Funciones 
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');


    //console.log(parseInt(presupuestoUsuario));//ParseInt solo funciona con los numeros enteros, con las decimales no 
    //console.log(parseFloat(presupuestoUsuario));//ParseFloat, sí tiene en cuenta los decimales cuando los convierte en numeros
    console.log( Number(presupuestoUsuario) );//Cualquier string los convierte en Números

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario<= 0){/* Si el dato que pasan no es nº, vuelve a mostrar la ventana emergente*/
        window.location.reload();
    }

    //Presupuesto Válido
   presupuesto = new Presupuesto(presupuestoUsuario);
   console.log(presupuesto);

   ui.insertarPresupuesto(presupuesto);
}


//Añadir Gatos
function agregarGasto(e){
    e.preventDefault();

    //Leer los datos el formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);


    //Validar
    if(  nombre === '' || cantidad === '') {
        ui.imprimirAlerta('¡Ambos campos son obligatorios!', 'error');
        return;

    } else if (cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no válida', 'error');
        return;
    }

    //Generar  un Objeto  (Literal) con el gato
    const gasto = {nombre, 
        cantidad, 
        id: Date.now()} //Extrae el nombre y la cantidad del gasto//(No confundir con el Object  Constructor)

    //Añade un nuevo Gasto
    presupuesto.nuevoGasto(gasto);

    ui.imprimirAlerta('Gasto añadido correctamente');

//Imprimir los Gastos
    const {gastos, restante}  = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    //Franja  colores  de aviso
    ui.comprobarPresupuesto(presupuesto);//Aquí solo estamos comprobando si el restante supera o no el presupuesto general

    //Reinicia el formulario
    formulario.reset();
}

function eliminarGasto(id) {
    //Elimina del  objeto
    presupuesto.eliminarGasto(id);

    //Elimina los gastos del html
    const {gastos,  restante} = presupuesto;

    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}