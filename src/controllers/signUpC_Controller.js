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
    console.log(req.body)
    const { nombre, telefono, correo, contraseña, confirm_password } = req.body;
    if (contraseña===confirm_password) {//revisa que se confirme correctamente la contraseña
        const clientes = await db.query("find","clientes",{$or:[{telefono:telefono},{correo:correo}]},{_id:0,correo:1})
        const proveedores = await db.query("find","proveedores",{$or:[{telefono:telefono},{correo:correo}]},{_id:0,correo:1})
        console.log(clientes)
        if(clientes.length > 0 || proveedores.length>0){//revisa que no este tratando de crear una cuenta con un correo o telefono ya utilizado
            res.json({status:"datos repetidos"})
        }else{
            const queryObject = {nombre: nombre, correo: correo, contraseña: contraseña, telefono: telefono, created_at: new Date(),imagen: 'https://res.cloudinary.com/foodiecloudinary/image/upload/v1722136335/FoxClient_vmriqx.jpg',active: true, proveedores: []};//crea un objeto con la info del usuario

            const result = await db.query("insert","clientes",queryObject,{})//hace el insert en la base de datos
            req.session.userID =  result.insertedId //guarda el ID en una variable de sesion
            req.session.userMail = correo
            req.session.userType = "cliente"
            console.log('Usuario registrado con éxito');
            const nuevoCarrito = await db.query("insert","pedidos",{cliente:req.session.userMail,estado:"Carrito",proveedor:"",especificaciones:"",descripcion:[],especificaciones:""})
            console.log(nuevoCarrito)
            res.json({status:"OK"});
        }
    } else {
        res.json({status:"error al confirmar contraseña"})
    }
    
});

router.use('/homeC', homeCController); //Home cliente
module.exports = router;