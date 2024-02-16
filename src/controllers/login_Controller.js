//Es donde se ejecuta todo del login
const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();
const homeCController = require('./homeC_Controller');//Importa rutas
const homePController = require('./homeP_Controller');
const globals = require('../services/globals');

router.get('/', (req, res) => {
    const loginPagePath = path.join(__dirname, '../../public/views/Login/login.html');
    res.sendFile(loginPagePath);
});

router.post('/', (req, res) => {
    const { email, password } = req.body;
    // Consulta SQL para buscar el usuario en la base de datos
    const sql1 = 'SELECT * FROM clientes WHERE BINARY correo = ? AND BINARY contraseña = ?';
    const sql2 = 'SELECT * FROM proveedores WHERE BINARY correo = ? AND BINARY contraseña = ?';

    db.query(sql1, [email, password], (err, results) => {
        if (err) {
            console.error('Error al buscar usuario:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        if (results.length > 0) {
            // El usuario existe y es un cliente, aquí puedes redirigirlo a una página de inicio de sesión exitosa

            //JANET!!!!!!!!!!!!     revisa el archivo globals.js para entender las siguientes 2 lineas
            globals.setID(results[0].id);//obtiene el id de la cuenta que inicio sesion y le da ese valor a la variable idUser
            console.log(globals.getID());//confirmacion del valor de idUser
            res.redirect(`/homeC`);
        } else {
            // El usuario no es un cliente así que busca si es proveedor
            db.query(sql2, [email, password], (err, results) => {
                if (err) {
                    console.error('Error al buscar usuario:', err);
                    res.status(500).send('Error interno del servidor');
                    return;
                }
                if (results.length > 0) {
                    // El usuario existe, aquí puedes redirigirlo a una página de inicio de sesión exitosa
                    
                    //JANET!!!!!!!!!!!!     revisa el archivo globals.js para entender las siguientes 2 lineas
                    globals.setID(results[0].id);//obtiene el id de la cuenta que inicio sesion y le da ese valor a la variable idUser
                    console.log(globals.getID());//confirmacion del valor de idUser
                    res.redirect('/homeP');
                } else {
                    // El usuario no existe o la contraseña es incorrecto
                    res.send(`<script>
                    window.location.href = "/login";
                    alert("Correo y/o contraseña incorrecta, intente de nuevo");
                    </script>`);
                }
            });
        }
    });
});
router.use(`/homeC`, homeCController); //Home cliente
router.use('/homeP', homePController); //Home Proveedor
module.exports = router;