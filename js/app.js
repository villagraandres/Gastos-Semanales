//variables
const formulario=document.querySelector('#agregar-gasto');
const gastoListado=document.querySelector('#gastos ul');


//eventos
eventListeners();

function eventListeners(){
document.addEventListener('DOMContentLoaded',preguntarPresupuesto);
formulario.addEventListener('submit',agregarGasto);
}


//classes

class Presupuesto{
    constructor(presupuesto){
        this.presupuesto=Number(presupuesto);
        this.restante=Number(presupuesto);
        this.gastos=[];
    }
    nuevoGasto(gasto){
        this.gastos=[...this.gastos,gasto];
      

        this.calcularRestante();
    }

    calcularRestante(){
        //sumamos el total de lo gastado
        const gastado=this.gastos.reduce((total,gasto)=> total + gasto.cantidad, 0);
        //restamos del presupuesto lo gastado
        this.restante=this.presupuesto-gastado;
    }

    eliminarGasto(id){
        this.gastos=this.gastos.filter(gasto=>gasto.id !== id);

        //llamamos de nuevo a esta funcion para que vuelva a calcular el restante 
        this.calcularRestante();
    }
}


class UI{
    insertarPresupuesto(cantidad){
        const {presupuesto,restante}=cantidad;
        document.querySelector('#total').textContent=presupuesto;
        document.querySelector('#restante').textContent=restante;

    }

    imprimirAlerta(mensaje,tipo){
        //crear el div
        const divMensaje=document.createElement('div');
        divMensaje.classList.add('text-center','alert');
        if(tipo==='error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }

        //mensaje de error
        divMensaje.textContent=mensaje;

        //insertar html
        document.querySelector('.primario').insertBefore(divMensaje,formulario);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    mostrarGastoListado(gastos){

        this.limpiarHTML();
        //iterar

        gastos.forEach(gasto => {
           const {cantidad,nombre,id}=gasto;

           //crear li
            const nuevoGasto=document.createElement('li');
            nuevoGasto.className='list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id=id;

           //agregar html
           nuevoGasto.innerHTML=`${nombre}<span class="badge badge-primary badge-pill">$${cantidad}</span>`
           //crear btn
           const btnBorrar=document.createElement('button');
           btnBorrar.onclick=()=>{
            eliminarGasto(id);
           }
           btnBorrar.classList.add('btn','btn-danger','borrar-gasto');
           btnBorrar.innerHTML='Borrar &times'
           nuevoGasto.appendChild(btnBorrar);

           gastoListado.appendChild(nuevoGasto);


        });
    }

    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }
    actualizarRestante(restante){
        document.querySelector('#restante').textContent=restante;
    }

    comprobarRestante(presupuestoObj){
        const {presupuesto,restante}=presupuestoObj;
        const restanteDiv=document.querySelector('.restante');


        //comprobar 25%
        if(( presupuesto /4 ) >= restante){

            restanteDiv.classList.remove('alert-sucess','alerta-warning');
            restanteDiv.classList.add('alert-danger');

        }else if((presupuesto / 2 ) >= restante){
            restanteDiv.classList.remove('alert-sucess');
            restanteDiv.classList.add('alert-warning');
        }else{
            restanteDiv.classList.remove('alert-danger','alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        // si el total es menor a cero
        if(restante<=0){
            ui.imprimirAlerta('El presupuesto se ha agotado','error'); 
            formulario.querySelector('button[type="submit"]').disabled=true;
        }
    }
}






//creamos la variable aqui para que este disponible de manera global
const ui= new UI();
let presupuesto;




//funciones

function preguntarPresupuesto(){

    
    const presupuestoUsuario= prompt('¿Cuál es tu presupuesto');
   

    if(presupuestoUsuario ==='' || presupuestoUsuario=== null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
        return;
    }

    presupuesto= new Presupuesto(presupuestoUsuario);
   ui.insertarPresupuesto(presupuesto)


}


function agregarGasto(e){
    e.preventDefault();

    //leer los datos del formulario
    const nombre=document.querySelector('#gasto').value;
    const cantidad=Number(document.querySelector('#cantidad').value);
    //validar
    if(nombre ==='' || cantidad ===''){
        ui.imprimirAlerta('Ambos campos son obligatorios','error');
        return;
    }else if(cantidad<=0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no válida','error');
        return;
    }

    //generar objeto con el gasto
    const gasto={nombre,cantidad,id:Date.now()} //une nombre y cantidad a la variable gasto
    presupuesto.nuevoGasto(gasto);

    ui.imprimirAlerta('Gasto Agregado','exito');

    //imprimir los gatos
    const {gastos,restante}=presupuesto;
    ui.mostrarGastoListado(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarRestante(presupuesto);

    //reiniciar formulario
    formulario.reset();
}

function eliminarGasto(id){
    //los elimina del objeto
    presupuesto.eliminarGasto(id);
    const {gastos,restante}=presupuesto;

    //los elimina del html
    ui.mostrarGastoListado(gastos);

    
    ui.actualizarRestante(restante);

    //cambia el color
    ui.comprobarRestante(presupuesto);
}

