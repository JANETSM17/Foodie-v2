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
console.log(total)
venta.textContent = `$${total.total}`


function setBarras(periodo) {
    const espacioGrafica = document.getElementById("ContenedorGrafica");
    espacioGrafica.innerHTML = ''
    const infoProductos = hacerSolicitud(`/providerProfileStatistics/infoProductos/${periodo}`);//productos vendidos en el periodo

    //Da valor a las marcas de la grafica
    let limiteSuperior= infoProductos[0].cantidad
    while(limiteSuperior%6!=0){
        limiteSuperior += 1
    }


    for(i=0;i<6;i++){
        let limite = document.getElementById(`marca ${i+1}`)
        let gapMarcas = limiteSuperior/6
        limite.textContent = `${limiteSuperior - (gapMarcas*i)}`
    }

    const barras = [];

    //Crea las barras para los productos

    function crearBarra(id,cantidad,categoria){
        const altura = ((cantidad/limiteSuperior)*37)
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
    listaProductos.innerHTML = ''
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
}

setBarras("1W")

function filtrar(id) {
    let categoriaBuscar = "";
    switch (id) {
        case "Comida":
            categoriaBuscar = "comida";
            break;
        case "Bebidas":
            categoriaBuscar = "bebidas";
            break;
        case "Frituras":
            categoriaBuscar = "frituras";
            break;
        case "Dulces":
            categoriaBuscar = "dulces";
            break;
        case "Otros":
            categoriaBuscar = "otros";
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