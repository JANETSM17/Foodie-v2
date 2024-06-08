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
  xhr.open('GET', url, false);  // El tercer parámetro indica si la solicitud es asíncrona
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

function crearRestaurante(id, nombre, rate, tiempo, ruta, estado) {
    const restaurante = document.createElement('div');
    restaurante.id = id;

   
    restaurante.innerHTML = `
      <button id="Cerrar" onclick="borrar(${id})"></button>
      <div class="logoComedor">
          <img id="logo" src="${ruta}" alt="${nombre}">
      </div>
      <h1 class="nombreComedor">${nombre}</h1>
      <div class="rateComedor">
          <p class="rate">${rate}</p>
          <img class="estrella" src="../Assets/Imagenes/Recursos%20Extras/estrella.png" alt="Estrella">
      </div>
      <div class="tiempoComedor">
          <img class="reloj" src="../Assets/Imagenes/Recursos%20Extras/reloj.png" alt="Reloj">
          <p class="tiempo">: ${tiempo} min</p>
      </div>
      <button id="ingresarComedor" onclick="entrarComedor(${id},${estado})">Entrar</button>
    `;
  
    return restaurante;
  }

  
  // Crear y agregar los restaurantes al contenedor
  var restaurantes = [];

  var resComedores = []//hacerSolicitud('/login/homeC/comedores')

  resComedores.forEach(item => {
    restaurantes.push(crearRestaurante(item.id,item.nombre,item.calif,item.min_espera,item.ruta,item.active));
  });
  
  const restauranteContainer = document.getElementById('comedoresDisponibles');
  let currentIndex = 0; // Índice actual en la lista de restaurantes

  const botonSiguiente = document.getElementById('Seguir');
  const botonAnterior = document.getElementById('Regresar');

  function mostrarRestaurantes(direccion) {

    if (direccion === 'anterior') { //Cambie esto
      currentIndex = (currentIndex + 1) % restaurantes.length;
    } else if (direccion === 'siguiente') { //Por esto
      currentIndex = (currentIndex - 1 + restaurantes.length) % restaurantes.length;
    }
    // Obtener los restaurantes segun su pocicion en el arregrlo
    const restauranteIzquierda = restaurantes[currentIndex];
    const restauranteMedio = restaurantes[(currentIndex + 1) % restaurantes.length];
    const restauranteDerecha = restaurantes[(currentIndex + 2) % restaurantes.length];

     // Borra el contenido actual del contenedor
    restauranteContainer.innerHTML = ''; 
   
    if (restaurantes.length >= 3) {
      restauranteIzquierda.classList = [];
      restauranteMedio.classList = [];
      restauranteDerecha.classList = [];

      restauranteIzquierda.classList.add('side1');
      restauranteMedio.classList.add('central');
      restauranteDerecha.classList.add('side2');
      /*
      restauranteIzquierda.classList.add('side1');
      restauranteMedio.classList.remove('side1');
      restauranteMedio.classList.remove('side2');
      restauranteDerecha.classList.add('side2');  


    restauranteIzquierda.classList.remove('central');
    restauranteMedio.classList.add('central');
    restauranteDerecha.classList.remove('central');
        */
    restauranteContainer.appendChild(restauranteIzquierda);
    restauranteContainer.appendChild(restauranteMedio);
    restauranteContainer.appendChild(restauranteDerecha); 
    
    
    } else if (restaurantes.length <= 2) {
    botonAnterior.style.display = 'none';
    botonSiguiente.style.display = 'none';


    restauranteIzquierda.classList.add("central")
    restauranteMedio.classList.add('central');

    restauranteContainer.appendChild(restauranteIzquierda);
    restauranteContainer.appendChild(restauranteMedio);
    }
  } 
  
  
  
  // Llama a la función inicialmente para mostrar los primeros restaurantes
  mostrarRestaurantes();
  

botonSiguiente.addEventListener('click', () => {
    mostrarRestaurantes('siguiente');
  });
  
  // Para retroceder al conjunto anterior de restaurantes
  botonAnterior.addEventListener('click', () => {
    mostrarRestaurantes('anterior');
  });

  function borrar(id) {

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/homeC/borrarComedor/${id}`, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log("Si jalo");
            } else {
                console.error('Error al borrar el comedor:', xhr.status);
            }
        }
    };
    window.location.href= '/homeC';
    xhr.send();
    }
    
  function entrarComedor(id,status) {
    if (status == 0) {
      alert("Parece ser que este comedor se encuentra cerrado, vuelve a \n intentar hacer un pedido cuando abra. Gracias <3");
  } else {
      /*const xhr = new XMLHttpRequest();
      xhr.open('GET', `/homeC/setMenu/${id}`, true);

      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                console.log("Si jalo");
              } else {
                  console.error('Error al entrar al comedor:', xhr.status);
              }
          }
      };
      xhr.send();*/
      hacerSolicitud(`/homeC/setMenu/${id}`)
      window.location.href = '/menu';
    }
  }