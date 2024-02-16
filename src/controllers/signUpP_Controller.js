const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();
const homePController = require('./homeP_Controller');
const globals = require('../services/globals')

const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';//para generar la clave de paso
var clave = '';//clave de paso que se hara
for (let i = 0; i < 6; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    clave += caracteres.charAt(indiceAleatorio);
    
}

router.get('/', (req, res) => {
    const signUpPPagePath = path.join(__dirname, '../../public/views/SingUp-P/singup-p.html');
    res.sendFile(signUpPPagePath);
});

router.post('/', (req, res) => {
    const { nombre, telefono, correo, contraseña, regimen, rfc ,direccion, password } = req.body;
    // Insertar el usuario en la base de dato
    const sql = `INSERT INTO proveedores (nombre, telefono, correo, contraseña, regimen_fiscal, rfc, direccion,clave_de_paso) VALUES (?, ?, ?, ?, ?, ?, ?,'${clave}')`;
    if(contraseña==password){
    db.query(sql, [nombre, telefono, correo, contraseña, regimen, rfc, direccion], (err, results) => {
        if (err) {
            console.error('Error al registrar el usuario: ' + err.message);
            res.send('No registrado con exito');
        } else {
            console.log('Usuario registrado con éxito');
            globals.setID(results.insertId);
            console.log(globals.getID());
            res.redirect('/homeP');
        }
    })}else{
        res.send(`<script>
                    window.location.href = "/signUp-P";
                    alert("La contraseña no fue confirmada correctamente");
                    </script>`);
    }
});

router.use('/homeP', homePController); //Home Proveedor
module.exports = router;