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
function irFoodiebox() {
    window.location.href = "/foodiebox";
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


function ligar(){
  let numserie = document.getElementById("numSerie").value
  console.log(numserie)
  const respuesta = hacerSolicitud(`/foodiebox/ligar/${numserie}`)
  console.log(respuesta)
  switch (respuesta.status) {
    case "OK":
      alert("La foodiebox se enlazó correctamente")
      break;
    case "Failed":
      alert("Se presentó un error en el enlace de la foodiebox\nIntente de nuevo más tarde")
      break;
    case "Not found":
      alert("No existe una foodiebox con ese numro de serie\nAsegúrese de ingresarlo correctamente")
      break;
    default:
      break;
  }
}