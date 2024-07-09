function irHome() {
    window.location.href = "/homeP";
  };
function irQA() {
    window.location.href = "/providerQA";
  };
function irContact() {
    window.location.href = "/contactUsE";
  };
function irProfile() {
    window.location.href = "/providerProfile";
  }

const pedidospendientes = document.getElementById("pedidospendientes");

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

function crearPedido(id, nombre,numerodepedido, telefono, especificaciones, total,descripcion,entrega) {
    const pedido = document.createElement('article');
    pedido.id = id + 'pedido';
    pedido.classList.add("pedido")
    
    pedido.innerHTML = `
        <div class="contacto">
            <div class="usuario">
                <img src="../Assets/Imagenes/Recursos extras/avatarN.png" alt="">
                <p>${nombre}</p>
            </div>
            <div class="numero">
                <p>Número de <br>Pedido:</p>
                <p id="numerodepedido">${numerodepedido}</p>
            </div>
            <p class="telefono">${telefono}</p>
        </div>
        <div class="division"></div>
        <div class="contenido">
            <ul class="productos">
                <li>${descripcion}</li>
            </ul>
        </div>
        <div class="comentario">
            <p>${especificaciones}</p>
        </div>
        <div class="precio">
            <p>Total:</p>
            <p>$${total}</p>
        </div>
        <div class="recogida">
            <p>Hora <span>de</span> Pick-Up</p>
            <p>${entrega}</p>
        </div>
        <div class="boton">
            Listo
            <button class="listo" id="listo${id}" onclick="listo('${id}')"></button>
        </div>
    `;
  
    // Agregar un event listener al botón "Listo"
    return pedido;
}

//para los pedidos en proceso

var  resPendientes = hacerSolicitud('/homeP/pedidos/En proceso');
var pedidos = [];

resPendientes.forEach(item => {
    pedidos.push(crearPedido(item.id,item.nombre,item.numerodepedido,item.telefono,item.especificaciones,item.total,item.descripcion,item.entrega));
  console.log(pedidos)
})



pedidos.forEach(pedido => {
    console.log(pedido)
    pedidospendientes.appendChild(pedido);
});


const buscar = document.getElementById("buscarpendiente");
const regresarBusqueda = document.getElementById('nobuscarpendiente');
 
buscar.addEventListener('click', function (){
    pedidospendientes.innerHTML = '' ; 
    const nombreBuscado = document.getElementById('busqueda').value.toLowerCase();
    pedidos.forEach(pedido => {
        // Verificar si el nombre del pedido coincide parcial o totalmente con el nombre buscado
        if (pedido.querySelector('.usuario p').innerText.toLowerCase().includes(nombreBuscado)) {
            pedidospendientes.appendChild(pedido.cloneNode(true)); // Clonar el nodo para evitar la eliminación del original
        } 
    });
        if (pedidospendientes.innerHTML == '') {
        alert('No Tienes Ningun Pedido Pendiente Con Ese Usuario')
        }

    regresarBusqueda.style.display = 'block';
})

regresarBusqueda.addEventListener('click', function(){
    pedidospendientes.innerHTML = '' ;   
    const nombreBuscado = document.getElementById('busqueda');
    nombreBuscado.value = "";
    regresarBusqueda.style.display = "none"
    renderizarPedidosPendientes();
})

function listo(id) {
    fetch(`/homeP/pedidoListo/${id}`)
    .then(window.location.reload())
    .catch(error => console.log('Error:', error));
}

//a partir de aqui son los pedidos listos


const pedidoslistos = document.getElementById("pedidoslistos");



function pedidoListo(id, nombre,numerodepedido, telefono, especificaciones, total,descripcion,entrega){
    const listo = document.createElement('article');
    listo.id = id + 'listo';
    listo.classList.add("pedido")
    listo.innerHTML = `
    <div class="contacto">
    <div class="usuario">
        <img src="../Assets/Imagenes/Recursos extras/avatarN.png" alt="">
        <p>${nombre}</p>
    </div>
    <div class="numero">
        <p>Número de <br>Pedido:</p>
        <p id="numerodepedido">${numerodepedido}</p>
    </div>
    <p class="telefono">${telefono}</p>
</div>
<div class="division"></div>
<div class="contenido">
    <ul class="productos">
        <li>${descripcion}</li>
    </ul>
</div>
<div class="comentario">
    <p>${especificaciones}</p>
</div>
<div class="precio">
    <p>Total:</p>
    <p>$${total}</p>
</div>
<div class="recogida">
    <p>Hora <span>de</span> Pick-Up</p>
    <p>${entrega}</p>
</div>
        <div class="boton">
            Entregado
            <button id="entregado" onclick="entregado('${id}')"></button>
        </div>
    `;
    return listo;
}

var listos = [];
var  resListos = hacerSolicitud('/homeP/pedidos/Listo para recoger');

resListos.forEach(item => {
    listos.push(pedidoListo(item.id,item.nombre,item.numerodepedido,item.telefono,item.especificaciones,item.total,item.descripcion,item.entrega));
  console.log(listos)
})

listos.forEach(listo => {
    pedidoslistos.appendChild(listo);
});
const buscarL = document.getElementById("buscarlisto");
const regresarBusquedaL = document.getElementById('nobuscarlisto');

buscarL.addEventListener('click', function (){
    pedidoslistos.innerHTML = '' ; 
    const nombreBuscadoL = document.getElementById('busquedaL').value.toLowerCase();
    listos.forEach(listo => {
        // Verificar si el nombre del pedido coincide parcial o totalmente con el nombre buscado
        if (listo.querySelector('.usuario p').innerText.toLowerCase().includes(nombreBuscadoL)) {
            pedidoslistos.appendChild(listo.cloneNode(true)); // Clonar el nodo para evitar la eliminación del original
        } 
    });
        if (pedidoslistos.innerHTML == '') {
        alert('No Tienes Ningun Pedido Listo Con Ese Usuario')
        }

    regresarBusquedaL.style.display = 'block';
})

regresarBusquedaL.addEventListener('click', function(){
    pedidoslistos.innerHTML = '' ; 
    const nombreBuscadoL = document.getElementById('busquedaL');
    nombreBuscadoL.value = "";  
    renderizarPedidosListos();
})


function renderizarPedidosPendientes() {
    pedidospendientes.innerHTML = '';
    pedidos.forEach(pedido => {
        pedidospendientes.appendChild(pedido);
    });
}

function renderizarPedidosListos() {
    pedidoslistos.innerHTML = '';
    listos.forEach(listo => {
        pedidoslistos.appendChild(listo);
    });
}

function entregado(id) {
    fetch(`/homeP/pedidoEntregado/${id}`)
    .then(window.location.reload())
    .catch(error => console.log('Error:', error));
}