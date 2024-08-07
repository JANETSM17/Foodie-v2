const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    if(!req.session.userID||req.session.userID==null||!req.session.userType||req.session.userType==null){
        res.redirect('/')
    }else{
        switch (req.session.userType) {
            case "proveedor":
                const ContactUsEPagePath = path.join(__dirname, '../../public/views/ContactUs/EnterpriseCU/ContactUsE.html');
                res.sendFile(ContactUsEPagePath);
                break;
            
            case "cliente":
                res.redirect('/contactUsC');
                break;

            default:
                res.redirect('/')
                break;
        }
    }
    
});

router.post('/', async (req, res) => {
    const { nombre, correo, telefono, mensaje} = req.body;
    // Insertar el usuario en la base de dato
    const resultado = await db.query("insert","comentarios",{nombre:nombre,correo:correo,telefono:telefono,mensaje:mensaje,created_at:new Date()})
    res.send(`<script>
        window.location.href = "/homeP";
        alert("Comentario enviado, gracias por su aportación");
        </script>`);
});

module.exports = router;