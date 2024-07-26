document.getElementById("botonBarra").addEventListener("click", function() {
    window.location.href = "/";
});

const formulario = document.getElementById("loginForm")

formulario.addEventListener('submit',async function(event){
    event.preventDefault()
    const formData = new FormData(this)
    const data = Object.fromEntries(formData.entries())
    console.log(data)
        fetch("/login",{
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
                case "cliente":
                    window.location.href = "/homeC"
                    break;
                case "proveedor":
                    window.location.href = "/homeP"
                    break;
                case "failed":
                    const pswrdField = document.getElementById('password');
                    pswrdField.style.border = "2px solid red";
                    const mail = document.getElementById('email');
                    mail.style.border = "2px solid red";
                    alert("Correo y/o contraseña incorrecta, intente de nuevo");
                    break;
                default:
                    console.log(data.status)
                    break;
            }
        })
})

