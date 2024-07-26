document.getElementById("botonBarra").addEventListener("click", function() {
    window.location.href = "../Landing/Landing.html";
});



const formulario = document.getElementById("registerForm")

formulario.addEventListener('submit',async function(event){
    event.preventDefault()
    const formData = new FormData(this)
    const data = Object.fromEntries(formData.entries())
    console.log(data)
        fetch("/signUp-C",{
            method:'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
              }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.status)
            switch (data.status) {
                case "OK":
                    window.location.href = "/homeC"
                    break;
                case "datos repetidos":
                    alert("Parece ser que ya existe una cuenta con el mismo correo y/o telefono")
                    break;
                case "error al confirmar contraseña":
                    alert("La contraseña fue confirmada incorrectamente")
                    break;
                default:
                    console.log(data.status)
                    break;
            }
        })
})