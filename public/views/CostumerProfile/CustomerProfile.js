//VENTANA MODALE DE Logout
document.addEventListener('DOMContentLoaded', function () {
  var Logout = document.getElementById('Logout');
  var closeLogoutBtn = document.getElementById('closeLogoutBtn');
  var modal = document.getElementById('LogoutModal');
  
  modal.style.display = 'none';

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

//VENTANA MODALE DE Delete
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
        xhr.open('POST', '/clientProfile/deleteAccount', true);
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

/*VENTANA MODALE DE PENDIENTE*/
document.addEventListener('DOMContentLoaded', function () {
  var Pendiente = document.getElementById('Pendiente');
  var closePendienteBtn = document.getElementById('closePendienteBtn');
  var modal = document.getElementById('modal');
  
  Pendiente.addEventListener('click', function () {
      modal.style.display = 'block';
  });
  closePendienteBtn.addEventListener('click', function () {
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