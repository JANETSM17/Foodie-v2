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
                const profilePMenuPagePath = path.join(__dirname, '../../public/views/EnterpriseProfile/EMenu/EMenu.html');
                res.sendFile(profilePMenuPagePath);
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

router.get('/productos',async (req,res) => {
    const resultado = await db.query("find","productos",{id_proveedor:db.objectID(req.session.userID)},{categoria:1,nombre:1,precio:1,descripcion:1,imagen:1,id:'$_id',active:1})
    res.json(resultado)
});

router.post('/updateSwitchState/:id', async (req, res) => {
    const id = req.params.id;
    const newState = req.body.state; // Obtener el nuevo estado del cuerpo de la solicitud
    // Actualizar el estado en la base de datos
    const resultado = await db.query("update","productos",{_id:db.objectID(id)},{$set:{active:newState}})
    if(resultado.modifiedCount>0){
        res.sendStatus(200);
    }else{
        return res.status(500).send("Error al actualizar el estado");
    }
});

router.post('/eliminarProducto/:id', async (req, res) => {
    const id = req.params.id;
    console.log("Se borra el producto")
    const resultado = await db.query("deleteOne","productos",{_id:db.objectID(id)})
    if(resultado.acknowledged){
        res.sendStatus(200)
    }else{
        res.status(500).send("Error al eliminar el producto");
    }
});

router.post('/agregarProducto', async (req, res) => {
    const {nombre,precio,descripcion,id_categoria} = req.body;
    let categoria
    switch (id_categoria) {
        case 1:
            categoria="comida"
            break;
        case 2:
            categoria="bebidas"
            break;
        case 3:
            categoria="dulces"
            break;
        case 4:
            categoria="frituras"
            break;
        case 5:
            categoria="otros"
            break;
        default:
            res.status(500).send("Categoria invalida");
            break;
    }
    console.log("Agregando producto")
    // Realizar la inserción del nuevo producto en la base de datos
    const resultado = await db.query("insert","productos",{nombre:nombre,precio:precio,descripcion:descripcion,id_proveedor:db.objectID(req.session.userID),imagen:"../../../Assets/Imagenes/Comida/burrito.png",categoria:categoria,active:true,created_at: new Date()})
    if(resultado.acknowledged){
        res.sendStatus(200)
    }else{
        res.status(500).send("Error al eliminar el producto");
    }

});

module.exports = router;