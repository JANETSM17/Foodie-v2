const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    if(!req.session.userID||req.session.userID==null||!req.session.userType||req.session.userType==null){
        res.redirect('/')
    }else{
        switch (req.session.userType) {
            case "cliente":
                const ContactUsCPagePath = path.join(__dirname, '../../public/views/ContactUs/CostumerCU/ContactUsC.html');
                res.sendFile(ContactUsCPagePath);
                break;
            
            case "proveedor":
                res.redirect('/contactUsP');
                break;

            default:
                res.redirect('/')
                break;
        }
    }
    const ContactUsCPagePath = path.join(__dirname, '../../public/views/ContactUs/CostumerCU/ContactUsC.html');
    res.sendFile(ContactUsCPagePath);
});

router.post('/', async (req, res) => {
    const { nombreC, correoC, telefonoC, mensajeC} = req.body;
    // Insertar el usuario en la base de dato
    const resultado = await db.query("insert","comentarios",{nombre:nombreC,correo:correoC,telefono:telefonoC,mensaje:mensajeC,created_at:new Date()})
    res.json({resultado})
});

module.exports = router;