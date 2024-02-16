const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();
const globals = require('../services/globals');

router.get('/', (req, res) => {
    const homecPagePath = path.join(__dirname, '../../public/views/confirmacionPedido/confirmacion.html');
    console.log('entras a confirmacion')
    console.log(globals.getID())
    res.sendFile(homecPagePath);
});
router.get('/pedidosEnCurso',(req,res) => {
    console.log('inicia el query')
    const sql = `select clientes.nombre as nombre,clientes.telefono as telefono, pedidos.id as id, pedidos.descripcion as descripcion, pedidos.especificaciones as especificaciones, pedidos.entrega as entrega, pedidos.total as total from pedidos join clientes on clientes.id = pedidos.id_cliente where id_cliente = ${globals.getID()} and (id_estado = 3 or id_estado = 4)`
    db.query(sql,(error,resultado)=>{
        if(error){
            console.error("Error"+error.message);
            return res.status(500).send("Error al consultar los datos");
        }else{
            console.log("si se pudo")
            console.log('los resultados son')
            console.log(resultado)
            res.json(resultado)
            
        };   

    })
});

module.exports = router;