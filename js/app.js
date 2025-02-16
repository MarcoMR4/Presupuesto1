
const ingresos = [   
    new Ingreso('Sueldo', 2000.00), 
    new Ingreso('Venta coche', 1500.00)
];

const egresos = [
    new Egreso('Renta departamento', 1114.00),
    new Egreso('Ropa', 400.00)
];

let cargarApp = () => {
    cargarCabecero(); 
    cargarIngresos();
    cargarEgresos();
}

let cargarCabecero = () => {
    let presupuesto = totalIngresos() - totalEgresos(); 
    let porcentajeEgreso = totalEgresos() / totalIngresos();

    document.getElementById('presupuesto').innerHTML = formatoMoneda(presupuesto);
    document.getElementById('porcentaje').innerHTML = formatoPorcentaje(porcentajeEgreso);
    document.getElementById('ingresos').innerHTML = formatoMoneda(totalIngresos());
    document.getElementById('egresos').innerHTML = formatoMoneda(totalEgresos());

}

let totalIngresos = () => {
    let totalIngreso = 0;
    for(let ingreso of ingresos){
        totalIngreso += ingreso.valor;
    }
    return totalIngreso;
}

let totalEgresos = () => {
    let totalEgreso = 0;
    for(let egreso of egresos){
        totalEgreso += egreso.valor;
    }
    return totalEgreso;
}

const formatoMoneda = (valor) => {
    return valor.toLocaleString('es-MX', {style: 'currency', currency:'MNX', minimumFractionDigits:2});
}

const formatoPorcentaje = (valor) => {
    return valor.toLocaleString('en-US', {style: 'percent', minimumFractionDigits: 2});
}

const cargarIngresos = () => {
    let ingresosHTML = ''; 
    for(let ingreso of ingresos){
        ingresosHTML += crearIngresoHTML(ingreso);
    }
    document.getElementById('lista-ingresos').innerHTML = ingresosHTML;
}

const cargarEgresos = () => {
    let egresosHTML = ''; 
    for(egreso of egresos){
        egresosHTML += crearEgresoHTML(egreso);
    }
    document.getElementById('lista-egresos').innerHTML = egresosHTML;
}

const crearIngresoHTML = (ingreso) => {
    let ingresoHTML = `
        <div class="elemento limpiarEstilos">
            <div class="elemento_descripcion">${ingreso.descripcion}</div>
            <div class="derecha limpiarEstilos">
                <div class="elemento_valor">+ ${formatoMoneda(ingreso.valor)}</div>
                <div class="elemento_eliminar">
                    <button class="elemento_eliminar--btn">
                        <ion-icon 
                            name="close-circle-outline"
                            onclick = 'eliminarIngreso(${ingreso.id})'
                        ></ion-icon>
                    </button>
                </div>
            </div>
        </div>
    `;
    return ingresoHTML;
}

const crearEgresoHTML = (egreso) => {
    let porcentajeEgreso = egreso.valor / totalIngresos();
    let egresoHTML = `
        <div class="elemento limpiarEstilos">
            <div class="elemento_descripcion">${egreso.descripcion}</div>
            <div class="derecha limpiarEstilos">
                <div class="elemento_valor">- ${formatoMoneda(egreso.valor)}</div>
                <div class="elemento_porcentaje">${formatoPorcentaje(porcentajeEgreso)}</div>
                <div class="elemento_eliminar">
                    <button class="elemento_eliminar--btn">
                        <ion-icon 
                            name="close-circle-outline"
                            onclick = 'eliminarEgreso(${egreso.id})'
                        ></ion-icon>
                    </button>
                </div>
            </div>
        </div>
    `;
    return egresoHTML;
}

const eliminarIngreso = (id) => {
    // for(let ingreso of ingresos){}
    let indiceEliminar = ingresos.findIndex(ingreso => ingreso.id === id);
    ingresos.splice(indiceEliminar, 1);
    cargarCabecero();
    cargarIngresos();
}

const eliminarEgreso = (id) => {
    let indiceEliminar = egresos.findIndex(egreso => egreso.id === id);
    egresos.splice(indiceEliminar, 1);
    cargarCabecero();
    cargarEgresos();
}

const agregarDato = () => {
    let form = document.forms['forma']; 
    let tipo = form['tipo'];
    let descripcion = form['descripcion']; 
    let valor = form['valor'];

    if(descripcion.value != '' && valor.value != ''){
        if(tipo.value === 'ingreso'){
            ingresos.push(new Ingreso(descripcion.value, +valor.value));
            cargarCabecero();
            cargarIngresos();
        }
        if(tipo.value === 'egreso'){
            egresos.push(new Egreso(descripcion.value, +valor.value));
            cargarCabecero();
            cargarEgresos();
        }
        document.getElementById("forma").reset();
    }
}

generarReporte = () => {
    generarPDF();
}

function obtenerFecha() {
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); 
    const año = fecha.getFullYear();
    
    return `${dia}/${mes}/${año}`;
}

function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Presupuesto", 20, 20);

    const fecha = obtenerFecha();
    doc.text("Fecha: " + fecha, 20, 30);

    doc.text("Ingresos:", 20, 50);
    let y = 60; 
    
    ingresos.forEach((ingreso, index) => {
        doc.text(`${ingreso.descripcion}: ${ingreso.valor.toLocaleString('es-MX', {style: 'currency', currency: 'MXN'})}`, 20, y);
        y += 10; 
    });

    doc.text("Egresos:", 20, y + 10); 
    y += 20; 

    egresos.forEach((egreso, index) => {
        doc.text(`${egreso.descripcion}: ${egreso.valor.toLocaleString('es-MX', {style: 'currency', currency: 'MXN'})}`, 20, y);
        y += 10;
    });

    const totalIngresos = ingresos.reduce((total, ingreso) => total + ingreso.valor, 0);
    const totalEgresos = egresos.reduce((total, egreso) => total + egreso.valor, 0);
    const presupuesto = totalIngresos - totalEgresos;

    doc.text(`Presupuesto disponible: ${presupuesto.toLocaleString('es-MX', {style: 'currency', currency: 'MXN'})}`, 20, y + 10);
    doc.text(`Total Ingresos: ${totalIngresos.toLocaleString('es-MX', {style: 'currency', currency: 'MXN'})}`, 20, y + 20);
    doc.text(`Total Egresos: ${totalEgresos.toLocaleString('es-MX', {style: 'currency', currency: 'MXN'})}`, 20, y + 30);

    doc.save("presupuesto.pdf");
}
