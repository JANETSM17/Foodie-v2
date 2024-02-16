function hacerSolicitud(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);  // El tercer parámetro indica si la solicitud es síncrona
    xhr.send();
  
    // Verificar el estado de la solicitud
    if (xhr.status === 200) {
      // Procesar la respuesta
      var respuesta = JSON.parse(xhr.responseText);
      return respuesta;
    } else {
      // Manejar errores
      console.error('Error en la solicitud:', xhr.status);
    }
  }

const venta = document.getElementById("CategoryTotal")
const total = hacerSolicitud("/providerProfileStatistics/ventaSemana")
venta.textContent = `$${total[0].total}`

const infoProductos = hacerSolicitud('/providerProfileStatistics/infoProductos');
const espacioGrafica = document.getElementById("ContenedorGrafica");
const barras = [];

function crearBarra(id,cantidad,categoria) {
    const altura = ((cantidad/30)*37)
    const barra = document.createElement("div")
    barra.id=id
    barra.classList.add("ProductBar")
    barra.classList.add(`${categoria}`)
    barra.style.height= altura + "vh";
    barra.innerHTML=`
        <p class="NoProducto" id="${categoria}">#${id}</p>
    `;
    return barra;
}

infoProductos.forEach(item => {
    barras.push(crearBarra(item.id,item.cantidad,item.categoria));
});

barras.forEach(barra => {
    espacioGrafica.appendChild(barra);
});

const listaProductos = document.getElementById("ListaProductos")
const nombres = [];

function crearNombre(id,cantidad,categoria,name) {
    const nombre = document.createElement("li")
    nombre.id=id
    nombre.classList.add("producto")
    nombre.classList.add(`${categoria}`)
    nombre.textContent=`#${id}: ${name} x${cantidad}`
    return nombre;
}

infoProductos.forEach(item => {
    nombres.push(crearNombre(item.id,item.cantidad,item.categoria,item.nombre));
});

nombres.forEach(nombre => {
    listaProductos.appendChild(nombre)
});


const top1 = document.getElementById("Top1")
top1.textContent=infoProductos[0].nombre;
const top2 = document.getElementById("Top2")
top2.textContent=infoProductos[1].nombre;
const top3 = document.getElementById("Top3")
top3.textContent=infoProductos[2].nombre;

function filtrar(id) {
    let categoriaBuscar = "";
    switch (id) {
        case "Comida":
            categoriaBuscar = "1";
            break;
        case "Bebidas":
            categoriaBuscar = "2";
            break;
        case "Frituras":
            categoriaBuscar = "3";
            break;
        case "Dulces":
            categoriaBuscar = "4";
            break;
        case "Otros":
            categoriaBuscar = "5";
            break;
        case "Todas":
            categoriaBuscar = "6";
            break;
    };
    if (categoriaBuscar == "6") {
        window.location.reload();
    } else {
        
    const barrasMostrar = barras.filter(barra => {
        const barrasCoinciden = Array.from(barra.classList);
        return barrasCoinciden.includes(categoriaBuscar);
    });
    if (barrasMostrar.length <= 0) {
        alert("No Tienes Ningun Producto De Esa Categoria");
    } else {
        espacioGrafica.innerHTML = "";

        barrasMostrar.forEach(result => {
            espacioGrafica.appendChild(result);
        })
    }
    }
}