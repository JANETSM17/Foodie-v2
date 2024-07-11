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
                const profilePPagePath = path.join(__dirname, '../../public/views/EnterpriseProfile/EProfile/EnterpriseProfile.html');
                res.sendFile(profilePPagePath);
                break;
            
            case "cliente":
                res.redirect('/clientProfile');
                break;

            default:
                res.redirect('/')
                break;
        }
    }
    
});

router.get('/infoP',async (req,res) => {
    console.log("Se busca la info del proveedor")
    const resultado = await db.query("find","proveedores",{_id:db.objectID(req.session.userID)},{_id:0,telefono:1,direccion:1,correo:1,nombre:1,clave:1,min_espera:1,calif:1})
    console.log("Se termina la busqueda")
    res.json({resultado})
});

router.get('/activeP',async (req,res) => {
    console.log("Se verifica el estado del proveedor")
    const resultado = await db.query("find","proveedores",{_id:db.objectID(req.session.userID)},{_id:0,active:1})
    console.log("Se termina la busqueda")
    res.json(resultado[0])
});

router.post('/updateSwitchState', async (req, res) => {
    console.log("Inicia la actualizacion de estado")
    const newState = req.body.state//===1?true:false; // Obtener el nuevo estado del cuerpo de la solicitud
    console.log(newState)
    // Actualizar el estado en la base de datos
    const resultado = await db.query("update","proveedores",{_id:db.objectID(req.session.userID)},{$set:{active:newState}})
    if(resultado.modifiedCount>0){
        res.sendStatus(200);
    }else{
        return res.status(500).send("Error al actualizar el estado");
    }
});


router.post('/changePassword', async (req, res) => {
    const previousPass = req.body.previousPass;
    const newPass = req.body.newPass;

    const resultado = await db.query("update","proveedores",{_id:db.objectID(req.session.userID),"contraseña":previousPass},{$set:{"contraseña":newPass}})
    if(resultado.modifiedCount>0){
        res.sendStatus(200);
    }else{
        return res.status(500).send("Error al actualizar la contraseña");
    }
});

router.post('/deleteAccount', async (req, res) => {
    const enteredPassword = req.body.password;

    //borra la cuenta que coincida en id y contraseña
    const resultado = await db.query("deleteOne","proveedores",{_id:db.objectID(req.session.userID),"contraseña":enteredPassword})
    if(resultado.deletedCount>0){
        const resBorrarProducts = await db.query("deleteMany","productos",{id_proveedor:db.objectID(req.session.userID)})
        if(resBorrarProducts.acknowledged){
            const resBrkLink = await db.query("update","clientes",{},{$pull:{proveedores:{id_proveedor:db.objectID(req.session.userID)}}})
            if(resBrkLink.acknowledged){
                res.redirect("/")
            }else{
                res.status(500).send("Error al desenlazar el proveedor con sus clientes")
            }
        }else{
            res.status(500).send("Error al borrar los productos del proveedor");
        }
    }else{
        res.status(500).send("Error al borrar la cuenta");
    }
});

router.post('/logout', (req, res) => {
    req.session.userID = null;
    req.session.selectedMenu = null;
    req.session.userType=null;
    req.session.userMail=null;
    res.sendStatus(200);
});

router.post('/updateDatabaseTiempo', async (req, res) => {
    const newValue = req.body.newValue;
    // Realiza la actualización del valor en la base de datos
    const resultado = await db.query("update","proveedores",{_id:db.objectID(req.session.userID)},{$set:{min_espera:newValue}})
    if(resultado.modifiedCount>0){
        res.sendStatus(200);
    }else{
        return res.status(500).send("Error al actualizar el tiempo de espera");
    }
});

router.post('/updateDatabaseCodigo', async (req, res) => {
    const newCodigo = req.body.newCodigo;
    // Realiza la actualización del valor en la base de datos
    const resultado = await db.query("update","proveedores",{_id:db.objectID(req.session.userID)},{$set:{clave:newCodigo}})
    if(resultado.modifiedCount>0){
        res.sendStatus(200);
    }else{
        return res.status(500).send("Error al actualizar la clave de paso");
    }
});

module.exports = router;