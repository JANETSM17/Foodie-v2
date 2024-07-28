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

let periodoActual = ''

let barras = [];



function setBarras(periodo) {
    periodoActual = periodo
    const espacioGrafica = document.getElementById("ContenedorGrafica");
    espacioGrafica.innerHTML = ''
    const infoProductos = hacerSolicitud(`/providerProfileStatistics/infoProductos/${periodo}`);//productos vendidos en el periodo
    let total = 0 //variable donde se guardara el total de ventas del periodo

    barras = []

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

    //Crea las barras para los productos

    function crearBarra(id,cantidad,categoria){
        let idCategoria = 0
        switch (categoria) {
            case "comida":
                idCategoria = "1"
                break;
            case "bebidas":
                idCategoria = "2"
                break;
            case "frituras":
                idCategoria = "3"
                break;
            case "dulces":
                idCategoria = "4"
                break;
            case "otros":
                idCategoria = "5"
                break;
            default:
                break;
        }
        const altura = ((cantidad/limiteSuperior)*37)
        const barra = document.createElement("div")
        barra.id=id
        barra.classList.add("ProductBar")
        barra.classList.add(`${categoria}`)
        barra.style.height= altura + "vh";
        barra.innerHTML=`
            <p class="NoProducto" id="${idCategoria}">#${id}</p>
        `;
        return barra;
    }

    infoProductos.forEach(item => {
        barras.push(crearBarra(item.id,item.cantidad,item.categoria));
        total += (item.precio*item.cantidad)
    });

    //agrega las barras a la pagina

    barras.forEach(barra => {
        
        espacioGrafica.appendChild(barra);
    });

    //actualiza el total de ventas

    const venta = document.getElementById("CategoryTotal")
    venta.textContent = `$${total}`

    //Crea la lista de los productos

    const listaProductos = document.getElementById("ListaProductos")
    listaProductos.innerHTML = ''
    const nombres = [];

    function crearNombre(id,cantidad,categoria,name) {
        let idCategoria = 0
        switch (categoria) {
            case "comida":
                idCategoria = "1"
                break;
            case "bebidas":
                idCategoria = "2"
                break;
            case "frituras":
                idCategoria = "3"
                break;
            case "dulces":
                idCategoria = "4"
                break;
            case "otros":
                idCategoria = "5"
                break;
            default:
                break;
        }
        const nombre = document.createElement("li")
        nombre.id=id
        nombre.classList.add("producto")
        nombre.classList.add(`${idCategoria}`)
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
        setBarras(periodoActual);
    } else {
        
    const barrasMostrar = barras.filter(barra => {
        const barrasCoinciden = Array.from(barra.classList);
        return barrasCoinciden.includes(categoriaBuscar);
    });
    if (barrasMostrar.length <= 0) {
        alert("No Tienes Ningun Producto De Esa Categoria");
    } else {
        const espacioGrafica = document.getElementById("ContenedorGrafica");
        espacioGrafica.innerHTML = '';

        barrasMostrar.forEach(result => {
            
            espacioGrafica.appendChild(result);
        })
    }
    }
}

var infoP = hacerSolicitud('/providerProfile/infoP').resultado;
const botonWidget = document.getElementById("buttonWidget")
const fotoPerfil = document.getElementById("fotoPerfil")
fotoPerfil.src = infoP[0].imagen

  document.addEventListener("DOMContentLoaded", function() {
    var myWidget = cloudinary.createUploadWidget({
        cloudName: 'foodiecloudinary', 
        uploadPreset: 'preset_chido'
    }, (error, result) => { 
        if (!error && result && result.event === "success") { 
            console.log('Done! Here is the image info: ', result.info);
            const data = {ruta:result.info.url}
            fetch(`clientProfile/updateImagen`,{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data=>{
              if(data.status==true){
                fotoPerfil.src = result.info.url
              }else{
                alert("Se presentó un error al actualizar la imagen de perfil\nIntente de nuevo más tarde")
              }
            })
            //const respuesta = hacerSolicitud(`clientProfile/updateImagen/${result.info.url}`)
            
        }
    });

    botonWidget.addEventListener("click", function() {
        myWidget.open();
    },false);
});