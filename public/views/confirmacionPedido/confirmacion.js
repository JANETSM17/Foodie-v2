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

function crearPedido(id, nombre, numerodepedido, telefono, especificaciones, total,descripcion,entrega,status,clave,pickup) {
    const pedido = document.createElement('article');
    pedido.id = id + 'pedido';
    pedido.classList.add("pedido")
    pedido.innerHTML = `
        <div class="contacto">
            <div class="usuario">
                <img src="../../Assets/Imagenes/Recursos extras/avatarN.png" alt="">
                <p>${nombre}</p>
            </div>
            <div class="numero">
                <p>Número de <br>Pedido:</p>
                <p id="numerodepedido">${id}</p>
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
        <div class="status">
            <p>Estado</p>
            <p>${status}</p>
        </div>
        <div class="clave">
            <p>Clave</p>
            <p>${clave}</p>
        </div>
        <div class="pick-up">
            <p>Metodo de pick-up</p>
            <p>${pickup}</p>
        </div>
    `;
  
    // Agregar un event listener al botón "Listo"
    return pedido;
}

//para los pedidos en proceso

var  resPendientes = hacerSolicitud('/pedidos/pedidosEnCurso');
var pedidos = [];

resPendientes.forEach(item => {
    pedidos.push(crearPedido(item.id,item.nombre,item.telefono,item.especificaciones,item.total,item.descripcion,item.entrega));
  console.log(pedidos)
})

pedidos.forEach(pedido => {
    console.log(pedido)
    pedidospendientes.appendChild(pedido);
});