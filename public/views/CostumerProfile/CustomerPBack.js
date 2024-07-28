function irHome() {
  window.location.href = "/homeC";
};
function irQA() {
  window.location.href = "/QA";
};
function irContact() {
  window.location.href = "/contactUsC";
};
function crearPedido(ruta,hora,total) {
    const pedido = document.createElement('div');
    pedido.classList.add("pedidoH")
    pedido.innerHTML =`
                    <div class="ImgH"><img src="../${ruta}" alt="" id="imagenPedidoH"></div>
                    <div class="FechaHora"><br><p id="horaPedido">${hora}</p></div>
                    <div class="Total"><b>Total:<br><p id="totalPedido">${total}</p></b></div>`
    return pedido;
}

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
  
const infoHist = hacerSolicitud("/clientProfile/getPedidosHist")
console.log(infoHist)
let pedidosH = [];
infoHist.res.forEach(item => {
    console.log("se crea un pedido")
    pedidosH.push(crearPedido(item.ruta,item.hora,item.total))
});

var histContenedor = document.getElementById("pedidos")

pedidosH.forEach(pedido => {
    console.log("Numero de pedidos: "+pedidosH.length)
    histContenedor.appendChild(pedido);
});


  function logout() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/clientProfile/logout', true); 
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log('Sesión cerrada con éxito');
                // Redirigir a la página de inicio o landing
                window.location.href = '/';
            } else {
                console.error('Error al cerrar sesión:', xhr.status);
            }
        }
    };
}


  
  const infoTotal = infoHist.total
  const infoUsr = hacerSolicitud("/clientProfile/infoC")
  const nombre = document.getElementById("name");
  nombre.textContent=infoUsr[0].nombre;
  const correo = document.getElementById("mail");
  correo.textContent=infoUsr[0].correo
  const tel = document.getElementById("phone")
  tel.textContent=infoUsr[0].telefono
  const fechaPage = document.getElementById("fecha")
  const fechaOrg = new Date(infoUsr[0].fecha)
  const dia = fechaOrg.getDate()
  const mes = fechaOrg.getMonth()+1
  const año = fechaOrg.getFullYear()
  fechaPage.textContent = `${año}/${mes}/${dia}`
  const totalCuenta = document.getElementById("totalCuenta")
  totalCuenta.textContent =  `$${infoTotal}`

  const botonWidget = document.getElementById("botonWidget")
  const fotoPerfil = document.getElementById("fotoPerfil")
  fotoPerfil.src = infoUsr[0].imagen

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
  
  const infoPedidoPendiente = hacerSolicitud("/clientProfile/getPedidoPendiente")
  if (infoPedidoPendiente.length==0) {
    const logoProveedor = document.getElementById("imgPendiente")
    const imagen = document.createElement("img")
    imagen.src=`../../assets/Imagenes/Logos/cubiertos.png`
    imagen.id="logoProvPend"
    logoProveedor.appendChild(imagen)
    const nombreProveedor = document.getElementById("nombrePendiente");
    nombreProveedor.textContent = "Sigue comprando con Foodie :)"
    const frase = document.getElementById("frase");
    frase.textContent = "No tienes pedidos pendientes"
    const productosPend = document.getElementById("listaProductosPendientes")
    productosPend.innerHTML = ''
    const frasePedidoPend = document.getElementById("tituloPedidoPendiente")
    frasePedidoPend.textContent = "No tienes un pedido pendiente de recoger,\nsigue comprando en foodie ;)"
    const numPedidoPend = document.getElementById("idPedidoPendiente")
    numPedidoPend.innerHTML = ''
  } else {
    const logoProveedor = document.getElementById("imgPendiente")
    const imagen = document.createElement("img")
    imagen.src=`../${infoPedidoPendiente[0].ruta}`
    imagen.id="logoProvPend"
    logoProveedor.appendChild(imagen)
    const nombreProveedor = document.getElementById("nombrePendiente");
    nombreProveedor.textContent = infoPedidoPendiente[0].nombre;
    const totalPendiente = document.getElementById("totalPendiente")
    totalPendiente.textContent = `$${infoPedidoPendiente[0].total}`;
  }
  
  // Obtiene el botón de hamburguesa y .profile
  const menuButton = document.querySelector('#check');
  const profile = document.querySelector('.profile');
  
  // Escucha eventos de cambio en el estado del botón de hamburguesa
  menuButton.addEventListener('change', function() {
    if (this.checked) {
      // Cuando se activa el botón, agrega la clase al cuerpo para bloquear el scroll
      document.body.classList.add('menu-active');
    } else {
      // Cuando se desactiva el botón, elimina la clase para habilitar el scroll
      document.body.classList.remove('menu-active');
    }
  });