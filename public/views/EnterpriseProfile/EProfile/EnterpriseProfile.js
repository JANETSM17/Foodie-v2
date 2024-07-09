/*VENTANAS MODALES*/ 
/*VENTANA MODALE DE Logout*/
document.addEventListener('DOMContentLoaded', function () {
    var Logout = document.getElementById('Logout');
    var closeLogoutBtn = document.getElementById('closeLogoutBtn');
    var modal = document.getElementById('LogoutModal');
    
    Logout.addEventListener('click', function () {
        modal.style.display = 'block';
    });
    closeLogoutBtn.addEventListener('click', function () {
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
});

/*VENTANA MODALE DE Cambiar Contrasena*/
document.addEventListener('DOMContentLoaded', function () {
    var ChangeP = document.getElementById('ChangeP');
    var closeChangePBtn = document.getElementById('closeChangePBtn');
    var modal = document.getElementById('ChangePModal');

    ChangeP.addEventListener('click', function () {
        modal.style.display = 'block';
    });
    closeChangePBtn.addEventListener('click', function () {
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
    document.getElementById('ConfirmNewPass').addEventListener('click', function () {
        // Obtén los valores de las contraseñas
        var previousPass = document.getElementById('PreviousPass').value;
        var newPass = document.getElementById('NewPass').value;

        // Envía una solicitud al backend para cambiar la contraseña
        changePassword(previousPass, newPass);
    });
});

function changePassword(previousPass, newPass) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/providerProfile/changePassword', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Envía la contraseña antigua y la nueva como datos JSON en el cuerpo de la solicitud
    xhr.send(JSON.stringify({ previousPass: previousPass, newPass: newPass }));

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                alert("Contraseña cambiada con exito");
                console.log('Contraseña cambiada con éxito');
                window.location.reload(); 
                // Cierra la ventana modal después de cambiar la contraseña
                modal.style.display = 'none';
            } else {
                console.error('Error al cambiar la contraseña:', xhr.status);
                alert('No se cambio la contraseña');
            }
        }
    };
}

/*VENTANA MODALE DE Delete*/
document.addEventListener('DOMContentLoaded', function () {
    var Delete = document.getElementById('Delete');
    var closeDeleteBtn = document.getElementById('closeDeleteBtn');
    var modal = document.getElementById('DeleteModal');

    Delete.addEventListener('click', function () {
        modal.style.display = 'block';
    });
    closeDeleteBtn.addEventListener('click', function () {
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

    document.getElementById('DeleteAccount').addEventListener('click', function () {
        // Obtén el valor de la contraseña para la eliminación de la cuenta
        var password = document.getElementById('PassDeleteAccount').value;
    
        // Envía una solicitud al backend para eliminar la cuenta
        deleteAccount(password);
    });
    
    function deleteAccount(password) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/providerProfile/deleteAccount', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
    
        // Envía la contraseña como datos JSON en el cuerpo de la solicitud
        xhr.send(JSON.stringify({ password: password }));
    
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log('Cuenta eliminada con éxito');
                    // Redirige a la página de inicio o landing después de eliminar la cuenta
                    window.location.href = '/';
                } else {
                    console.error('Error al eliminar la cuenta:', xhr.status);
                    // Puedes mostrar un mensaje de error al usuario si lo deseas
                };
            };
        };
    };
    
});

function handleImageUpload() {
    // Obtener el elemento de entrada de archivo y la imagen mostrada
    const input = document.getElementById('imageUpload');
    const imagenMostrada = document.getElementById('openModalImage');

    // Verificar si se seleccionó un archivo
    if (input.files && input.files[0]) {
        // Crear un objeto FileReader para leer el archivo
        const reader = new FileReader();

        // Configurar la función de devolución de llamada cuando la lectura se complete
        reader.onload = function (e) {
            // Mostrar la imagen cargada
            imagenMostrada.src = e.target.result;
            imagenMostrada.style.display = 'block';

            // Aquí podrías realizar acciones adicionales, como enviar la imagen al servidor para guardarla
            // o realizar otro procesamiento necesario.
        };

        // Leer el contenido del archivo como una URL de datos
        reader.readAsDataURL(input.files[0]);
    }
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
function setToggle() {
    let activeState = hacerSolicitud('/providerProfile/activeP')
    let toggle = document.getElementById("toggleSwitch")
    toggle.checked = activeState.active
}
setToggle()