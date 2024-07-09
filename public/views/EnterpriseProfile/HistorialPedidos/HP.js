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

function CrearProductoHistoria(numerodepedido, total, ruta, NombreUsuario, descripcion, hora) {
    const producto = document.createElement("div");
    producto.id = numerodepedido
    producto.className = "pedido";
    producto.innerHTML = `
    <div class="Pedido">
                <div class="CustomerImage">
                    <img class="imagenProducto" src="${ruta}" alt="${NombreUsuario}" id="CustomerImage">
                </div>
                <p id="CustomerName">${NombreUsuario}</p>
                <hr class="line">
                <div class="NoProductos">Productos: <span id="NoProductos"> ${descripcion}</span></div>
                <div class="FechaPedido">${hora}</div>
                <div class="TotalPedido">Total: <b>$<span id="TotalPedido">${total}</b></span></div>
            </div>
    `;
    return producto;
}
let pedidos = [];

const historia = document.getElementById("Historial")

const infoHist = hacerSolicitud("/providerProfileHistory/getPedidosHist")
infoHist.forEach(item => {
  pedidos.push(CrearProductoHistoria(item.numerodepedido,item.total,item.ruta,item.nombre,item.descripcion,item.hora))
});

pedidos.forEach(producto => {
    console.log(producto)
    historia.appendChild(producto);
});

const contador = document.getElementById("NoResults")
const numProductos = document.getElementsByClassName("pedido");
contador.textContent=`Mostrando ${numProductos.length} resultados`;

function buscar() {
  const nombreBuscar = document.getElementById("busqueda").value.toLowerCase();

  // Filtrar los pedidos que coinciden con el nombre de búsqueda
  const resultados = pedidos.filter(producto => {
    const nombreProducto = producto.querySelector("#CustomerName").textContent.toLowerCase();
    return nombreProducto.includes(nombreBuscar);
  });
  if (nombreBuscar == "") {
      alert("Agrega un nombre de usuario para buscar");
  } else {
    if (resultados.length <= 0) {
      alert("No tienes Ningun Pedido De Ese Usuario");
    } else {
      // Limpiar el historial actual
      historia.innerHTML = "";

      // Mostrar los resultados encontrados
      resultados.forEach(result => {
        historia.appendChild(result);
      });

      // Actualizar el contador con el número de resultados
      const contador = document.getElementById("NoResults");
      contador.textContent = `Mostrando ${resultados.length} resultados`; 
      const nobuscar = document.getElementById("nobuscar");
      nobuscar.style.display = "flex";
    }
  }
}
function nobuscar(){
  const nobuscar = document.getElementById("nobuscar");
  const nombreBuscar = document.getElementById("busqueda");
  nombreBuscar.value = "";
      nobuscar.style.display = "none";
      historia.innerHTML = "";
      window.location.reload();
}