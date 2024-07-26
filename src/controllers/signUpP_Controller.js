const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();
const homePController = require('./homeP_Controller');

const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';//para generar la clave de paso
var clave//clave de paso que se hara

function crearClave() {
    clave=""
    for (let i = 0; i < 6; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
        clave += caracteres.charAt(indiceAleatorio);
        
    }
}

crearClave()

/*for (let i = 0; i < 6; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    clave += caracteres.charAt(indiceAleatorio);
    
}*/

router.get('/', (req, res) => {
    const signUpPPagePath = path.join(__dirname, '../../public/views/SingUp-P/singup-p.html');
    res.sendFile(signUpPPagePath);
});

router.post('/', async (req, res) => {
    const { nombre, telefono, correo, contraseña, regimen, rfc ,direccion, password } = req.body;
    // Insertar el usuario en la base de dato
    if(contraseña==password){
        const proveedores = await db.query("find","proveedores",{$or:[{telefono:telefono},{correo:correo},{rfc:rfc}]},{_id:0,correo:1})
        const clientes = await db.query("find","clientes",{$or:[{telefono:telefono},{correo:correo}]},{_id:0,correo:1})

        if(proveedores.length > 0 || clientes.length > 0){//revisa que no este tratando de crear una cuenta con un correo o telefono ya utilizadp
            res.json({status:"datos repetidos"})
        }else{
            const claves = await db.query("find","proveedores",{},{clave:1,_id:0})
            crearClave()
            while(claves.some(elem=>elem.clave == clave)){
                crearClave()
            }
            const queryObject = {nombre: nombre, correo: correo, contraseña: contraseña, telefono: telefono,rfc:rfc, created_at: new Date(),imagen: '../assets/Imagenes/Logos/cubiertos.png',active: true, "regimen fiscal": regimen, direccion: direccion, calif: 0, min_espera:15,clave:clave};//crea un objeto con la info del usuario

            const result = await db.query("insert","proveedores",queryObject)//hace el insert en la base de datos
            req.session.userID = await result.insertedId //guarda el ID en una variable de sesion
            req.session.userType = "proveedor"
            req.session.userMail = correo
            console.log('Usuario registrado con éxito');
            res.json({status:"OK"})
        }
    }else{
        res.json({status:"error al confirmar contraseña"})
    }
});

router.use('/homeP', homePController); //Home Proveedor
module.exports = router;