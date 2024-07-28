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

var infoP = hacerSolicitud('/providerProfile/infoP').resultado;
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