const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();
const homeCController = require('./homeC_Controller');//Importa rutas

router.get('/', (req, res) => {
    const signUpCPagePath = path.join(__dirname, '../../public/views/SingUp-C/singup-c.html');
    res.sendFile(signUpCPagePath);
});

router.post('/', async (req, res) => {
    const { nombre, telefono, correo, contraseña, confirm_password } = req.body;
    if (contraseña===confirm_password) {//revisa que se confirme correctamente la contraseña
        const usuarios = await db.query("find","clientes",{$or:[{telefono:telefono},{correo:correo}]},{})
        console.log(usuarios)
        if(usuarios.length > 0){//revisa que no este tratando de crear una cuenta con un correo o telefono ya utilizadp
            res.send('Correo o telefono ya registrado en otra cuenta, intente de nuevo')
        }else{
            const queryObject = {nombre: nombre, correo: correo, contraseña: contraseña, telefono: telefono, created_at: new Date(),imagen: 'rutaImaginaria.jpg',active: true, proveedores: []};//crea un objeto con la info del usuario

            const result = await db.query("insert","clientes",queryObject,{})//hace el insert en la base de datos
            req.session.userID = await result.insertedId //guarda el ID en una variable de sesion
            req.session.userMail = correo
            req.session.userType = "cliente"
            console.log('Usuario registrado con éxito');
            res.redirect('/homeC');
        }
        
    } else {
        res.send(`<script>
                    window.location.href = "/signUp-C";
                    alert("La contraseña no fue confirmada correctamente");
                    </script>`);
    }
    
});

router.use('/homeC', homeCController); //Home cliente
module.exports = router;