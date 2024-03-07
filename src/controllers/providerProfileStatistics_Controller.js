const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    const profilePStatisticsPagePath = path.join(__dirname, '../../public/views/EnterpriseProfile/Estadisticas/Estadisticas.html');
    res.sendFile(profilePStatisticsPagePath);
});

router.get('/infoProductos',(req,res) => {
    console.log('obtenemos las estadisticas')
    const sql = `select productos.nombre as nombre, productos.id_categoria as categoria, productos.id as id, SUM(productos_pedidos.cantidad) as cantidad from productos join productos_pedidos on productos_pedidos.id_producto = productos.id where productos_pedidos.id_pedido in (select id from pedidos where created_at >= NOW()- INTERVAL 1 WEEK AND id_estado=5) and productos.id_proveedor = ${req.session.userID} group by productos.id order by cantidad desc;`
    db.query(sql,(error,resultado)=>{
        if(error){
            console.error("Error"+error.message);
            return res.status(500).send("Error al consultar los datos");
        }else{
            console.log("se obtuvieron los productos")
            console.log(resultado)
            res.json(resultado)
            
        };   

    })
});

router.get('/ventaSemana',(req,res) => {
    console.log('obtenemos el total de la semana')
    const sql = `select SUM(pedidos.total) as total from pedidos where created_at >= NOW()- INTERVAL 1 WEEK AND id_estado=5 and id in (select id_pedido from productos_pedidos where id_producto in (select id from productos where id_proveedor = ${req.session.userID}))`
    db.query(sql,(error,resultado)=>{
        if(error){
            console.error("Error"+error.message);
            return res.status(500).send("Error al consultar los datos");
        }else{
            console.log("se obtuvieron los productos")
            console.log(resultado)
            res.json(resultado)
            
        };   

    })
});

module.exports = router;