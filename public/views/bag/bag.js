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

//para la info del usuario

const infoUsr = hacerSolicitud('/bag/getUsrInfo');
const nombre = document.getElementById("usrName");
const numTel = document.getElementById("usrPhone");
const bagItems = document.getElementById("bagItems");
nombre.textContent = infoUsr[0].nombre;
numTel.textContent = infoUsr[0].telefono;

//para la info de los productos del pedido

const infoCarrito = hacerSolicitud('/bag/getPedido');
const idCarrito = infoCarrito.id;
const proveedorCarrito = infoCarrito.proveedor
var infoProveedor
if(proveedorCarrito){
  infoProveedor = hacerSolicitud(`/bag/confirmarFoodieBox/${proveedorCarrito}`)
  if(!infoProveedor.status){
    let foodieBoxCheck = document.getElementById("foodiecheck")
    foodieBoxCheck.disabled = true
  }
  proveedorAbierto = infoProveedor.active
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


  function crearProductoPedido(ruta, nombre, precio, id,cantidad) {
    const productoPedido = document.createElement("div");
    productoPedido.classList.add("producto");
    productoPedido.setAttribute("name","bagItems")
    productoPedido.innerHTML = `
        <div class="foto">
            <img src=${ruta} alt="${nombre}">
        </div>
        <div class="linea"></div>
        <p>${nombre}</p>
        <p class="precioU">$${precio}</p>
        <div class="total">
            <input type="number" name="cantidad${id}" id="cantidad" value="${cantidad}" readonly>
            <div class="botones">
                <button class="aumentar" onclick="modificarCantidad(event, 'aumentar', ${precio});updtCantidad('${id}')"></button>
                <button class="disminuir" onclick="modificarCantidad(event, 'disminuir', ${precio});updtCantidad('${id}')"></button>
            </div>
        </div>
        <p class="precioT">$${precio*cantidad}</p>
        <button class="cerrar" onclick="quitarProducto('${id}')"></button>
    `;
    return productoPedido;
}
const contenedorProductos = document.getElementById("productos");


const pedidoPendienteArreglo = [];


const infoProductosCarrito = hacerSolicitud(`/bag/getProductos/${idCarrito}`);

infoProductosCarrito.forEach(item => {
  pedidoPendienteArreglo.push(crearProductoPedido(item.imagen,item.nombre,item.precio,item._id,item.cantidad))
});

pedidoPendienteArreglo.forEach(productoPedido => {
    contenedorProductos.appendChild(productoPedido);
});

bagItems.textContent = "Productos en el carrito: " + document.getElementsByClassName("producto").length;

function modificarCantidad(event, accion, precio) {
    let inputHermano = event.target.parentNode.previousElementSibling;
    let valorActual = parseInt(inputHermano.value);
    if (accion === 'aumentar' && valorActual < 9) {
      inputHermano.value = valorActual + 1;
    } else if (accion === 'disminuir' && valorActual > 1) {
      inputHermano.value = valorActual - 1;
      
    }
    inputHermano.parentNode.nextElementSibling.textContent = "$" + inputHermano.value * precio;
    obtenerTotalProductos();
  }
  obtenerTotalProductos();
  function updtCantidad(id_producto){
    const producto = document.getElementsByName(`cantidad${id_producto}`)[0];
    const cantidad = producto.value;
    hacerSolicitud(`/bag/actualizarCantidad/${id_producto}/${cantidad}/${idCarrito}`)
  }

  function quitarProducto(idProducto){
    hacerSolicitud(`/bag/quitarProducto/${idProducto}/${idCarrito}`);
    window.location.href = "/bag"
  }


  function enviarPedido() {
    const foodieBoxCheck = document.getElementById("foodiecheck")
    const pagoMostradorCheck = document.getElementById("foodiechecknt")
    if(foodieBoxCheck.checked||pagoMostradorCheck.checked){
      if(infoProveedor.active){
        let infoConfirm = hacerSolicitud('/bag/confirmar');
        console.log(infoConfirm)
        let cuenta = infoConfirm.cuenta;
  
        if (document.getElementsByClassName("producto").length==0) {
          alert("No puedes hacer un pedido sin productos")
          window.location.href = "/homeC"
        }else{
          if (cuenta == 0) {
            console.log("Se manda el pedido")
            let especificacionesCampo = document.getElementById("especificaciones");
            let especificaciones = especificacionesCampo.value
            if (especificaciones.length==0){
              especificaciones="Pedido sin especificaciones especiales";
            }
  
            let esperaUsr = document.getElementById("minutos").value
            let infoEsperaReal = hacerSolicitud(`/bag/confirmarEspera/${idCarrito}`);
            let esperaReal = infoEsperaReal[0].min_espera;
            console.log("los minutos de espera son:" + esperaReal)
      
            const pickup = foodieBoxCheck.checked ? "foodiebox" : "mostrador"
              
            if (esperaUsr<esperaReal) {
              hacerSolicitud(`/bag/enviarPedido/${idCarrito}/${esperaReal}/${especificaciones}/${pickup}`);
              alert("El tiempo seleccionado era menor al\ntiempo minimo de espera de su comedor, por\n lo que se le asignara el tiempo de espera\nminimo.");    
            }else{
              hacerSolicitud(`/bag/enviarPedido/${idCarrito}/${esperaUsr}/${especificaciones}/${pickup}`); 
            }
            window.location.href = '/pedidos';
          }else{
            alert("Lo lamentamos, pero parece ser que tienes un pedido pendiente de recoger. \nNo podras hacer un pedido nuevo hasta que pagues y recojas tu pedido anterior");
            window.location.href = '/pedidos';
          }
        }
      }else{
        alert(`Parece ser que la cafeteria "${infoProveedor.nombre}" está cerrada.\nIntente hacer su pedido mas tarde. ;)`)
      }
    }else{
      alert("Seleccione un metodo de entrega")
    }
  }

  function validarNumeros(input) {
    // Eliminar caracteres no numéricos usando una expresión regular
    input.value = input.value.replace(/\D/g, '');
  }

  function obtenerTotalProductos() {
    const total = document.getElementById("totalBag");
    const elementosPrecioT = document.querySelectorAll('.precioT');
    let suma = 0;

    // Itera sobre cada elemento y suma su valor al total
    elementosPrecioT.forEach(elemento => {
        const valor = parseFloat(elemento.textContent.slice(1));
        suma += valor;
    });

    total.textContent = "Total: $"+suma
}


function toggleCheckboxes(clickedId, otherId) {
  let clickedCheckbox = document.getElementById(clickedId);
  let otherCheckbox = document.getElementById(otherId);

  if (clickedCheckbox.checked) {
      otherCheckbox.checked = false;
  }
}
