const contenedorI = document.getElementById("info");
const contenedorN = document.getElementById("name");
const contenedorC = document.getElementById("clave");
const contenedorT = document.getElementById("tiempo");
const contenedorR = document.getElementById("rate");

// Para poder rellenar la info del restaurante -----------------------------------------------------------
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
  //Rellenar info general
function rellenarinfo(telefono, direccion, correo){
    contenedorI.innerHTML = `
                <p><b>Número de telefono:</b> ${telefono}</p>
                <p><b>Dirección:</b> ${direccion}</p>
                <p><b>Correo Electrónico:</b> ${correo}</p>
    `;
    return contenedorI;
}

function rellenarName(nombre){
    contenedorN.innerHTML = `
    ${nombre}`;
    return contenedorN;
}

function rellenarCodigo(codigo){
    contenedorC.innerHTML = `
    <p>Código del comedor: <br> <b>${codigo}</b></p>
    <button class="Button" id="ChangeC" onclick="handleChangeCodigo()" >Cambiar código</button>
    `;
    return contenedorC;
}

function rellenartiempo(min_espera){
    contenedorT.innerHTML = `
    <p class="PTime">Tiempo de preparación por pedido:</p>
    <p class="PTime"><b>${min_espera}</b></p>
    <button class="Button" id="Modificar" onclick="modificarValorT()">Modificar</button>             
    `;
    return contenedorT;
}

function rellenarRate(calif){
    contenedorR.innerHTML = `
    <p>Tu calificación como restaurante:</p>
    <div class="Stars">
        <img src="../../Assets/Imagenes/Recursos extras/estrella.png" alt="">
    </div>
    <p><b>${calif}</b></p>            
    `;
    return contenedorR;
}
var infoP = hacerSolicitud('/providerProfile/infoP').resultado;
console.log(infoP)
var infoGen = [];
var infoNombre = [];
var infoCodigo = [];
var infoTiempo = [];
var infoRate = [];


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

infoP.forEach(item => {
    infoGen.push(rellenarinfo(item.telefono, item.direccion, item.correo));
    infoNombre.push(rellenarName(item.nombre));
    infoCodigo.push(rellenarCodigo(item.clave));
    infoTiempo.push(rellenartiempo(item.min_espera));
    infoRate.push(rellenarRate(item.calif));
});

infoGen.forEach(item => {
    contenedorI.appendChild(item);
});
infoNombre.forEach(item => {
    contenedorN.appendChild(item);
});
infoCodigo.forEach(item => {
    contenedorC.appendChild(item);
});
infoTiempo.forEach(item => {
    contenedorT.appendChild(item);
});
infoRate.forEach(item => {
    contenedorR.appendChild(item);
});

//funcion para dar el valor actual del active al toggleswitch


function toggleSwitch() {
    var switchElement = document.getElementById("toggleSwitch");
    var slider = document.querySelector(".Slider");
    
    // Obtener el estado actual del interruptor (1 o 0)
    var switchState = switchElement.checked ? true : false;

    // Llamar a la función que envía la solicitud al backend
    updateSwitchState(switchState);
}

// Función para enviar el estado del interruptor al backend
function updateSwitchState(state) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/providerProfile/updateSwitchState', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Enviar el estado como datos JSON en el cuerpo de la solicitud
    xhr.send(JSON.stringify({ state: state }));

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log('Estado del interruptor actualizado con éxito');
            } else {
                console.error('Error al actualizar el estado del interruptor:', xhr.status);
            }
        }
    };
}

function logout() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/providerProfile/logout', true); 
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
    // Función para manejar la modificación del valor
    function modificarValorT() {
        // Muestra un prompt para ingresar un nuevo valor (solo números)
        var nuevoValor = prompt('Ingrese un nuevo valor (solo números):');

        // Verifica si se ingresó un valor y si es un número
        if (nuevoValor !== null && !isNaN(nuevoValor)) {
            // Convierte el valor a número
            nuevoValor = parseFloat(nuevoValor);

            // Envía una solicitud al backend para guardar el nuevo valor en la base de datos
            updateDatabaseTiempo(nuevoValor);
        } else {
            // Muestra un mensaje si se ingresó un valor no válido
            alert('Ingrese un valor válido (solo números).');
        }
    }
// Función para enviar el nuevo valor al backend y actualizar la base de datos
function updateDatabaseTiempo(newValue) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/providerProfile/updateDatabaseTiempo', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Envía el nuevo valor como datos JSON en el cuerpo de la solicitud
    xhr.send(JSON.stringify({ newValue: newValue }));

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log('Valor actualizado con éxito en la base de datos');
                rellenartiempo(newValue);
            } else {
                console.error('Error al actualizar el valor en la base de datos:', xhr.status);
            }
        }
    };
}

// Función para manejar el cambio de código
function handleChangeCodigo() {
    // Muestra un prompt para ingresar un nuevo valor (solo 6 caracteres)
    var nuevoValor = prompt('Ingrese un nuevo código (solo 6 caracteres):');

    // Verifica si se ingresó un valor
    if (nuevoValor !== null) {
        // Limita la longitud del nuevo valor a 6 caracteres
        nuevoValor = nuevoValor.slice(0, 6);

        // Convierte el valor a mayúsculas
        nuevoValor = nuevoValor.toUpperCase();

        // Envía una solicitud al backend para guardar el nuevo valor en la base de datos
        updateDatabaseCodigo(nuevoValor);
    }
}

// Función para enviar el nuevo valor del código al backend y actualizar la base de datos
function updateDatabaseCodigo(newCodigo) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/providerProfile/updateDatabaseCodigo', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Envía el nuevo valor como datos JSON en el cuerpo de la solicitud
    xhr.send(JSON.stringify({ newCodigo: newCodigo }));

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log('Código actualizado con éxito en la base de datos');
                // Actualiza el contenido en la interfaz con el nuevo código
                rellenarCodigo(newCodigo);
            } else {
                console.error('Error al actualizar el código en la base de datos:', xhr.status);
            }
        }
    };
}
