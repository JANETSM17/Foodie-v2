const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();
const globals = require('../services/globals');
const profilePController = require('./providerProfile_Controller');
const contactUsEController = require("./contactUsE_Controller")

router.get('/', (req, res) => {
    const homepPagePath = path.join(__dirname, '../../public/views/homeP/homep.html');
    res.sendFile(homepPagePath);
});

router.get('/pedidosEnCurso',(req,res) => {
    console.log('inicia el query')
    const sql = `select pedidos.id as id, clientes.nombre as nombre, clientes.telefono as telefono, pedidos.especificaciones as especificaciones, pedidos.total as total, pedidos.descripcion as descripcion, pedidos.entrega as entrega from pedidos join clientes on pedidos.id_cliente=clientes.id where pedidos.id_estado = 3 AND pedidos.id in (select id_pedido from productos_pedidos where id_producto in (select id from productos where id_proveedor = ${globals.getID()}))`
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

router.get('/pedidoListo/:id',(req,res)=>{
    const id = req.params.id;
    const sql = `update pedidos set id_estado = 4 where id = ${id}`
    console.log('id='+id)
    db.query(sql,(error)=>{
        if(error){
            console.error("No funciono el delete "+error.message)
        }else{
            console.log("si se pudo actualizar el pedido");
        }
    })
})

router.get('/pedidosListos',(req,res) => {
    console.log('inicia el query')
    const sql = `select pedidos.id as id, clientes.nombre as nombre, clientes.telefono as telefono, pedidos.especificaciones as especificaciones, pedidos.total as total, pedidos.descripcion as descripcion, pedidos.entrega as entrega from pedidos join clientes on pedidos.id_cliente=clientes.id where pedidos.id_estado = 4 AND pedidos.id in (select id_pedido from productos_pedidos where id_producto in (select id from productos where id_proveedor = ${globals.getID()}))`
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

router.get('/pedidoEntregado/:id',(req,res)=>{
    const id = req.params.id;
    const sql = `update pedidos set id_estado = 5 where id = ${id}`
    console.log('id='+id)
    db.query(sql,(error)=>{
        if(error){
            console.error("No funciono el delete "+error.message)
        }else{
            console.log("si se pudo actualizar el pedido");
        }
    })
})

router.use('/perfilProveedor', profilePController);
router.use('/contactP', contactUsEController);
module.exports = router;
//res.send('Llegaste a home Proveedor');