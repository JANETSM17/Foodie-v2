function irHome() {
    window.location.href = "/homeP";
  };

const formulario = document.getElementById("commentForm")

formulario.addEventListener('submit',async function(event){
    event.preventDefault()
    const formData = new FormData(this)
    const data = Object.fromEntries(formData.entries())
    console.log(data)
    let ready = true
    for(const key in data){
      const input = document.getElementById(key+"E")
      if(data[key]==""){
        input.style.border = "2px solid red"
        ready = false
      }else{
        input.style.border = "none"
      }
    }

    if(ready){
      fetch("/contactUsC",{
        method:'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
          }
      })
      .then(response => response.json())
      .then(data => {
        console.log(data.status)
        if(data.status){
          alert("Comentario enviado, gracias por su aportacion")
          window.location.href = "/homeP";
        }else{
          alert("Error al enviar el comentario, intente de nuevo mas tarde")
        }
      })
    }else{
      alert("Rellene todos los campos antes de enviar un mensaje")
    }
})