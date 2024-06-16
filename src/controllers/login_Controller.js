//Es donde se ejecuta todo del login
const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();
const homeCController = require('./homeC_Controller');//Importa rutas
const homePController = require('./homeP_Controller');

router.get('/', (req, res) => {
    const loginPagePath = path.join(__dirname, '../../public/views/Login/login.html');
    res.sendFile(loginPagePath);
});

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    // Consulta SQL para buscar el usuario en la base de datos

    const cliente = await db.query("find","clientes",{correo:email,"contraseña":password},{_id:1})
    console.log(cliente)
    if(cliente.length>0){
        req.session.userID = cliente[0]._id;//obtiene el id de la cuenta que inicio sesion y le da ese valor a la variable idUser
        req.session.userType = "cliente"
        req.session.userMail = email
        console.log(req.session.userID);//confirmacion del valor de idUser
        res.redirect(`/homeC`);
    }else{
        const proveedor = await db.query("find","proveedores",{correo:email,password:password},{_id:1})
        if(proveedor.length>0){
            req.session.userID = proveedor[0]._id;//obtiene el id de la cuenta que inicio sesion y le da ese valor a la variable idUser
            req.session.userType = "proveedor"
            req.session.userMail = email
            console.log(req.session.userID);//confirmacion del valor de idUser
            res.redirect(`/homeP`);
        }else{
            res.send(`<script>
                window.location.href = "/login";
                alert("Correo y/o contraseña incorrecta, intente de nuevo");
                </script>`);
        }
    }

});

router.get('/app/:email/:password', async(req,res)=>{
    const email = req.params.email
    const password = req.params.password
    const cliente = await db.query("find","clientes",{correo:email,"contraseña":password},{_id:1})
    console.log(cliente)
    if(cliente.length>0){
        res.json({id:cliente[0]._id,tipoCuenta:"cliente",email:email,status:"succes"})//crea un JSON con la info
    }else{
        const proveedor = await db.query("find","proveedores",{correo:email,password:password},{_id:1})
        if(proveedor.length>0){
            res.json({id:cliente[0]._id,tipoCuenta:"proveedor",email:email,status:"succes"})//crea un JSON con la info
        }else{
            res.json({status:"failed"})
        }
    }
})
router.use(`/homeC`, homeCController); //Home cliente
router.use('/homeP', homePController); //Home Proveedor
module.exports = router;