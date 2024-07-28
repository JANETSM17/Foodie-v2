function poderEditar() {
    alert("Si lo que quieres es editar la informacion de un producto puedes hacerlo desde la foodie app");
}

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

function crearProductoMenu(id, imagen, nombre, categoria, descripcion, precio, active) {
    const producto = document.createElement('div');
    producto.id = id;
    producto.className = "producto";
    producto.innerHTML = `
                <div class="foto">
                    <img src="${imagen}" alt="${nombre}">
                </div>
                <div class="division"></div>
                <div class="nombres">
                    <p class="nombre">${nombre}</p>
                    <p class="categoria">(${categoria})</p>
                </div>
                <p class="descripcion">
                ${descripcion}
                </p>
                <div class="SwitchContainer">
                    <label class="Switch">
                        <input type="checkbox" class="toggleSwitch" id="toggleSwitch-${id}" onclick="toggleSwitch(${id})">
                        <span class="Slider"></span>
                    </label>
                </div>
                <p class="precio">$${precio}</p>
                <button class="masInfo" onclick="poderEditar()"></button>
                <button id="eliminarProducto" onclick="eliminarProducto('${id}')" class="cerrar"></button>
            </div>
    `;
    let miCheckbox = producto.querySelector('.toggleSwitch');
    if (active) {
        miCheckbox.checked = true;
    } else {
        miCheckbox.checked = false;
    }


    return producto;
}

const menu = document.getElementById("menu");

let resProductos = hacerSolicitud('/providerProfileMenu/productos');
let productoMenu = [];

resProductos.forEach(producto =>{
    productoMenu.push(crearProductoMenu(producto.id, producto.imagen, producto.nombre, producto.categoria, producto.descripcion, producto.precio, producto.active))
})

productoMenu.forEach(producto => {
    menu.appendChild(producto);
})



function toggleSwitch(id) {
    var switchElement = document.getElementById(`toggleSwitch-${id}`);

    var slider = document.querySelector(".Slider");

    // Obtener el estado actual del interruptor (1 o 0)
    var switchState = switchElement.checked ? 1 : 0;
    // Llamar a la función que envía la solicitud al backend
    updateSwitchState(switchState,id);
}

// Función para enviar el estado del interruptor al backend
function updateSwitchState(state,id) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', `/providerProfileMenu/updateSwitchState/${id}`, true);
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

function eliminarProducto(id){
    alert("eliminando")
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        // Hacer la solicitud al servidor para eliminar el producto
        var xhr = new XMLHttpRequest();
        xhr.open('POST', `/providerProfileMenu/eliminarProducto/${id}`, true);
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // Eliminar el producto del DOM si la eliminación en el servidor fue exitosa
                    var producto = document.getElementById(id);
                    producto.parentNode.removeChild(producto);
                    console.log('Producto eliminado con éxito');
                } else {
                    console.error('Error al eliminar el producto:', xhr.status);
                }
            }
        };
    }
}

/*VENTANA MODALE DE AGREGAR PRODUCTO*/
document.addEventListener('DOMContentLoaded', function () {
    var agregarProducto = document.getElementById('agregarProducto');
    var closeAgregarPBtn = document.getElementById('closeAgregarPBtn');
    var modal = document.getElementById('AgregarPModal');
    
    agregarProducto.addEventListener('click', function () {
        modal.style.display = 'block';
    });
    closeAgregarPBtn.addEventListener('click', function () {
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

    // Evento de clic para el botón "Agregar"
    document.getElementById('Agregar').addEventListener('click', function () {
        // Recopilar datos ingresados por el usuario
        const newName = document.getElementById('NewName').value;
        const newPrice = document.getElementById('NewPrice').value;
        const newDescription = document.getElementById('ProductDescription').value;

        // Verificar que se hayan ingresado todos los datos necesarios
        if (!newName || !newPrice || !newDescription || !selectedCategory) {
            alert("Por favor, complete todos los campos antes de agregar el producto.");
            return;
        }

        // Objeto con los datos del nuevo producto
        const newProduct = {
            nombre: newName,
            precio: newPrice,
            descripcion: newDescription,
            id_categoria: selectedCategory,
            // Agrega más campos según sea necesario
        };

        // Enviar la solicitud POST al servidor
        agregarNuevoProducto(newProduct);
    });


    // Función para enviar la solicitud POST al servidor para agregar un nuevo producto
    function agregarNuevoProducto(producto) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/providerProfileMenu/agregarProducto', true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        // Enviar los datos del producto como JSON en el cuerpo de la solicitud
        xhr.send(JSON.stringify(producto));

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log('Producto agregado con éxito');
                    window.location.href = '/providerProfileMenu';
                } else {
                    console.error('Error al agregar el producto:', xhr.status);
                }
            }
        };
    }

});

let selectedCategory = 0;

function assignCategory(categoryNumber, id) {

    let elementos = document.querySelectorAll('.NewCategoria');

// Itera sobre la NodeList y cambia el fondo de cada elemento
    elementos.forEach(function (elemento) {
        elemento.style.backgroundColor = 'white'; // Cambia el color de fondo a blanco, puedes ajustar esto según tus necesidades
    });
    selectedCategory = categoryNumber;
    const botonSeleccionado = document.getElementById(id);
    botonSeleccionado.style.backgroundColor = "#efefef"; 
}