const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();
const globals = require('../services/globals');

router.get('/', (req, res) => {
    const profilePHistoryPagePath = path.join(__dirname, '../../public/views/EnterpriseProfile/HistorialPedidos/HP.html');
    res.sendFile(profilePHistoryPagePath);
});

router.get('/getPedidosHist',(req,res) => {
    const sql = `select distinct pedidos.id as id, clientes.ruta as ruta,clientes.nombre as nombre,pedidos.descripcion as descripcion, pedidos.created_at as hora, pedidos.total as total from clientes join pedidos on pedidos.id_cliente = clientes.id join productos_pedidos on productos_pedidos.id_pedido = pedidos.id join productos on productos.id = productos_pedidos.id_producto join proveedores on productos.id_proveedor = proveedores.id where proveedores.id = ${globals.getID()}`
    db.query(sql,(error,resultado)=>{
        if(error){
            console.error("Error"+error.message);
            return res.status(500).send("Error al consultar los datos");
        }else{
            console.log("el historial es:")
            console.log(resultado)
            res.json(resultado)
            
        };   

    })
});

module.exports = router;