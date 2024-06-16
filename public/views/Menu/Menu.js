function irHome() {
    window.location.href = "/homeC";
  };
  function irQA() {
    window.location.href = "/QA";
  };
  function irContact() {
    window.location.href = "/contactUsC";
  };
  function irBag() {
    window.location.href = "/bag";
  };
  function irProfile() {
    window.location.href = "/clientProfile";
  }
  function irPedidos() {
    window.location.href = "/pedidos";
  };


//funcion para mandar llamar URLs
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

  //Aqui es para obtener info del proveedor

const comedor = document.getElementById("comedor")
function mostrarComedor(nombre,rate, foto) {
    comedor.innerHTML = `
    <img class="foto" src="../../${foto}" alt="">    
    <div class="info">
        <p>${nombre}</p>
        <div class="rate">
            <p>${rate}</p>
            <img id="estrella" src="../../Assets/Imagenes/Recursos extras/estrella.png" alt="">
        </div>
    </div>
    <div class="categorias">
        <p>Categorias</p>
        <div class="nombres">
            <a href="#Comida">Comida</a>
            <a href="#Bebidas">Bebidas</a>
            <a href="#Frituras">Frituras</a>
            <a href="#Dulces">Dulces</a>
            <a href="#Otros">Otros</a>
            <button id="Calificar">Calificar</button>
        </div>
    </div>
    `
}

var infoComedor = hacerSolicitud('/menu/queCafe')

infoComedor.forEach(item => {
    mostrarComedor(item.nombre,item.calif,item.imagen)
});


//aqui para obtener los productos de todo

function crearProducto(imagen, nombre, precio , descripcion, id){
    const producto = document.createElement('div');
    producto.classList.add("productofase1");
    producto.innerHTML = `
    <div class="producto">
         <button onclick="descripcion(event)" class="producto">
             <div class="fotop">
                 <img src="../../Assets/Imagenes/Comida/${imagen}" alt="${nombre}">
             </div>
             <p class="nombrep">${nombre}</p>
             <p class="precio">$${precio}</p>
             </button>
             <button  title="Agregar a la bolsa" onclick="agregarCarritoRapido('${id}')"class="agregar"></button>
    </div>
    <div class="productoExtendido">
         <div class="info2">
             <div class="fotop">
                 <img src="../../Assets/Imagenes/Comida/${imagen}" alt="${nombre}">
             </div>
             <p class="nombrep">${nombre}</p>
         </div>
         <div class="division"></div>
         <div class="descripcion">
             Descripcion
             <div class="ingredientes">
                ${descripcion}
             </div>
         </div>
         <div class="final">
             <button class="cerrar" onclick="cerrarDescripcion(event)"></button>
             <p class="precio">$${precio}</p>
             <button class="agregar2" onclick="agregarCarritoRapido('${id}')">Agregar a la bolsa</button>
         </div>
    </div> `;
    return producto;
}

//mostrarComedor("4.5","Dominos_Logo.png");/


const comida = document.getElementById("Comida");
const bebidas = document.getElementById("Bebidas");
const frituras = document.getElementById("Frituras");
const dulces = document.getElementById("Dulces");
const otros = document.getElementById("Otros");



comidaArreglo = []
comida.innerHTML = "<p>Comida</p>";

const infoComida = hacerSolicitud('/menu/comida');
infoComida.forEach(item => {
    comidaArreglo.push(crearProducto(item.imagen,item.nombre,item.precio,item.descripcion,item._id))
});

comidaArreglo.forEach(producto => {
    comida.appendChild(producto);
});




// Productos para Bebidas
const bebidasArreglo = [];

bebidas.innerHTML = "<p>Bebidas</p>";

const infoBebidas = hacerSolicitud('/menu/bebidas');
infoBebidas.forEach(item => {
    bebidasArreglo.push(crearProducto(item.imagen,item.nombre,item.precio,item.descripcion,item._id))
});

bebidasArreglo.forEach(producto => {
    bebidas.appendChild(producto);
});
// Productos para Frituras
const friturasArreglo = [];

frituras.innerHTML = "<p>Frituras</p>";

const infoFrituras = hacerSolicitud('/menu/frituras');
infoFrituras.forEach(item => {
    friturasArreglo.push(crearProducto(item.imagen,item.nombre,item.precio,item.descripcion,item._id))
});

friturasArreglo.forEach(producto => {
    frituras.appendChild(producto);
});
// Productos para Dulces
const dulcesArreglo = [];

dulces.innerHTML = "<p>Dulces</p>";

const infoDulces = hacerSolicitud('/menu/dulces');
infoDulces.forEach(item => {
    dulcesArreglo.push(crearProducto(item.imagen,item.nombre,item.precio,item.descripcion,item._id))
});

dulcesArreglo.forEach(producto => {
    dulces.appendChild(producto);
});



// Productos para Otros
const otrosArreglo = [];

const infoOtros = hacerSolicitud('/menu/otros');
infoOtros.forEach(item => {
    otrosArreglo.push(crearProducto(item.imagen,item.nombre,item.precio,item.descripcion,item._id))
});

otros.innerHTML = "<p>Otros</p>";
otrosArreglo.forEach(producto => {
    otros.appendChild(producto);
});






function descripcion(event) {
    let boton = event.currentTarget;
    let producto = boton.parentNode;
    let producto2 = boton.parentNode.nextElementSibling;
    let productofase1 = boton.parentNode.parentNode;
    productofase1.style.width = "100%";
    producto.style.display = "none";
    producto2.style.display = "flex";

}
function cerrarDescripcion(event) {
    let cerrar = event.target;
    let producto2 = cerrar.parentNode.parentNode;
    let producto = cerrar.parentNode.parentNode.previousElementSibling;
    let productofase3 = cerrar.parentNode.parentNode.parentNode;
    productofase3.style.width = "400px";
    producto.style.display = "flex";
    producto2.style.display = "none";
    
}

function modificarCantidad(event, accion) {
    var inputHermano = event.target.parentNode.previousElementSibling;
    var valorActual = parseInt(inputHermano.value);

    if (accion === 'aumentar' && valorActual < 9) {
      inputHermano.value = valorActual + 1;
    } else if (accion === 'disminuir' && valorActual > 1) {
      inputHermano.value = valorActual - 1;
    }
  }

  const infoCarrito = hacerSolicitud('/bag/getPedido');
    const idCarrito = infoCarrito[0]._id;

  function agregarCarritoRapido(id_producto) {
    const infoConfirm = hacerSolicitud(`/menu/confirmar/${id_producto}/${idCarrito}`);
    const cuenta = infoConfirm.length;
    alert(cuenta)

    if (cuenta.length == 0) {
        hacerSolicitud(`/menu/agregarCarrito/${id_producto}/1/${idCarrito}`)
        alert("Producto agregado")
    }else{
        alert('Ya has agregado este producto a tu carrito.\nSi deseas agregar mas elementos de este articulo,\n modifica la cantidad desde el apartado de "Bolsa"')
    } 
  }
  
  //VENTANA MODALE DE CALIFICAR/
document.addEventListener('DOMContentLoaded', function () {
    var Calificar = document.getElementById('Calificar');
    var closeCalificarBtn = document.getElementById('closeCalificarBtn');
    var modal = document.getElementById('CalificarModal');
    
    Calificar.addEventListener('click', function () {
        modal.style.display = 'block';
    });
    closeCalificarBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });
    // Cerrar la ventana modal haciendo clic fuera de ella
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    // Cerrar la ventana modal al presionar la tecla Esc
    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            modal.style.display = 'none';
        }
    });

// SELECCIONAR ESTRELLAS
const stars =document.querySelectorAll('.Star');

stars.forEach(function(star, index){
    star.addEventListener('click', function() {
        for (let i=0; i<=index; i++) {
            stars[i].classList.add('checked');
        }
        for (let i=index+1; i<stars.length; i++) {
            stars[i].classList.remove('checked');
        }
        //alert('Estrella ' + (index + 1) + ' seleccionada');
    })
})

function getSelectedRating() {
    const stars = document.querySelectorAll('.Star.checked');
    return stars.length;
}
const acceptRateBtn = document.getElementById('AcceptRate');
    acceptRateBtn.addEventListener('click', function () {
        const rating = getSelectedRating(); // Obtener la calificación seleccionada
        enviarCalificacion(rating); // Llamar a la función para enviar la calificación a la base de datos
    });

    function enviarCalificacion(rating) {
        const url = '/menu/calificar'; // Ruta del servidor para manejar la calificación
        const data = { rating: rating };

        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, false);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const responseData = JSON.parse(xhr.responseText);
                    console.log('Respuesta del servidor:', responseData);
                } else {
                    console.error('Error al enviar la calificación. Estado:', xhr.status);
                }
            }
        };
        xhr.send(JSON.stringify(data));
        window.location.href = "/menu";
    }
    
});