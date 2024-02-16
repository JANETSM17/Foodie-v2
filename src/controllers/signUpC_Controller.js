const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();
const homeCController = require('./homeC_Controller');//Importa rutas
const globals = require('../services/globals')


router.get('/', (req, res) => {
    const signUpCPagePath = path.join(__dirname, '../../public/views/SingUp-C/singup-c.html');
    res.sendFile(signUpCPagePath);
});

router.post('/', (req, res) => {
    const { nombre, telefono, correo, contraseña, confirm_password } = req.body;
    // Insertar el usuario en la base de dato
    const sql = 'INSERT INTO clientes (nombre, telefono, correo, contraseña) VALUES (?, ?, ?, ?)';
    if (contraseña===confirm_password) {
        db.query(sql, [nombre, telefono, correo, contraseña], (err, results) => {
        if (err) {
            console.error('Error al registrar el usuario: ' + err.message);
            res.send('No registrado con exito');
        } else {
            globals.setID(results.insertId);
            console.log(globals.getID());
            console.log('Usuario registrado con éxito');
            res.redirect('/homeC');
        }
    });  
    } else {
        res.send(`<script>
                    window.location.href = "/signUp-C";
                    alert("La contraseña no fue confirmada correctamente");
                    </script>`);
    }
    
});

router.use('/homeC', homeCController); //Home cliente
module.exports = router;