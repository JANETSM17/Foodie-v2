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

router.post('/', (req, res) => {
    const { nombreC, correoC, telefonoC, mensajeC} = req.body;
    // Insertar el usuario en la base de dato
    const sql = 'INSERT INTO comentarios (nombreC,  correoC, telefonoC, mensajeC) VALUES (?, ?, ?, ?)';
      db.query(sql, [nombreC, correoC, telefonoC, mensajeC], (err, results) => {
        if (err) {
            console.error('Error al registrar el comentario: ' + err.message);
            res.send('No registrado con exito');
        } else {
            console.log('Comentario registrado con éxito');
            res.send('Registrado con exito');
        }
    });  
});

module.exports = router;