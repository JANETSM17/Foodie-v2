const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    const homecPagePath = path.join(__dirname, '../../public/views/bag/bag.html');
    console.log('entras a bolsa')
    console.log(req.session.userID)
    res.sendFile(homecPagePath);
});

router.get('/getUsrInfo',(req,res) => {
    console.log('inicia la consulta del usuario')
    const sql = `select nombre, telefono from clientes where id = ${req.session.userID}`
    db.query(sql,(error,resultado)=>{
        if(error){
            console.error("Error"+error.message);
            return res.status(500).send("Error al consultar los datos");
        }else{
            console.log("se obtuvieron los datos del usuario")
            console.log(resultado)
            res.json(resultado)
            
        };   

    })
})

router.get('/getProductos',(req,res) => {
    console.log('inicia la consulta del carrito')
    const sql = `select id, nombre, imagen, precio from productos where id in (select id_producto from productos_pedidos where id_pedido = (select id from pedidos where id_cliente = ${req.session.userID} and id_estado = 1))`
    db.query(sql,(error,resultado)=>{
        if(error){
            console.error("Error"+error.message);
            return res.status(500).send("Error al consultar los datos");
        }else{
            console.log("se obtuvieron los productos del carrito")
            console.log(resultado)
            res.json(resultado)
            
        };   

    })
})

router.get('/getPedido',(req,res) => {
    console.log('inicia el query para obtener el id del carrito')
    const sql = `select id from pedidos where id_cliente = ${req.session.userID} and id_estado = 1`
    db.query(sql,(error,resultado)=>{
        if(error){
            console.error("Error"+error.message);
            return res.status(500).send("Error al consultar los datos");
        }else{
            console.log("se obtuvo el id del carrito: "+ resultado[0].id)
            res.json(resultado)
            
        };   

    })
})

router.get('/enviarPedido/:id/:espera',(req,res) => {
    const id = req.params.id
    const espera = req.params.espera
    console.log('inicia el envio del pedido')
    const sql = `call sndOrd(${id},${req.session.userID},${espera})`
    db.query(sql,(error,resultado)=>{
        if(error){
            console.error("Error"+error.message);
            return res.status(500).send("Error al consultar los datos");
        }else{
            res.json(resultado)
            
        };   

    })
})
router.get('/enviarEspecificaciones/:texto',(req,res) => {
    const texto = req.params.texto
    console.log('inicia el envio de especificaciones')
    const sql = `update pedidos set especificaciones = '${texto}' where id_cliente = ${req.session.userID} and id_estado = 1`
    db.query(sql,(error,resultado)=>{
        if(error){
            console.error("Error"+error.message);
            return res.status(500).send("Error al consultar los datos");
        }else{
            res.json(resultado)
            
        };   

    })
})

router.get('/confirmar',(req,res) => {
    console.log('inicia la confirmacion')
    const sql = `select count(*) as cuenta from pedidos where id_cliente = ${req.session.userID} and (id_estado = 3 or id_estado = 4)`
    db.query(sql,(error,resultado)=>{
        if(error){
            console.error("Error"+error.message);
            return res.status(500).send("Error al consultar los datos");
        }else{
            console.log('termina la confirmacion')
            res.json(resultado)
            
        };   

    })
})

router.get('/actualizarCantidad/:idProducto/:cantidad/:idCarrito',(req,res) => {
    const idProducto = req.params.idProducto;
    const cantidad = req.params.cantidad;
    const idCarrito = req.params.idCarrito
    console.log(idProducto)
    console.log(cantidad)
    console.log('Inicia el actualizar')
    const sql = `update productos_pedidos set cantidad = ${cantidad} where id_producto = ${idProducto} and id_pedido = ${idCarrito}`
    db.query(sql,(error,resultado)=>{
        if(error){
            console.error("Error"+error.message);
            return res.status(500).send("Error al consultar los datos");
        }else{
            console.log('Se actualizo la cantidad del producto')
            res.json(resultado)
            
        };   
    })
})

router.get('/confirmarEspera/:idCarrito',(req,res) => {
    const carrito = req.params.idCarrito
    console.log('inicia la confirmacion del tiempo de espera')
    const sql = `select min_espera from proveedores where id = (select id_proveedor from productos where id in (select id_producto from productos_pedidos where id_pedido = ${carrito}) order by id_proveedor desc limit 1)`
    db.query(sql,(error,resultado)=>{
        if(error){
            console.error("Error"+error.message);
            return res.status(500).send("Error al consultar los datos");
        }else{
            console.log(resultado)
            res.json(resultado)
            
        };   

    })
})

router.get('/quitarProducto/:idProducto/:idCarrito',(req,res) => {
    const idProducto = req.params.idProducto;
    const idCarrito = req.params.idCarrito
    console.log(idProducto)
    console.log(idCarrito)
    console.log('Inicia la eliminacion del producto del carrito')
    const sql = `delete from productos_pedidos where id_producto = ${idProducto} AND id_pedido = ${idCarrito}`
    db.query(sql,(error,resultado)=>{
        if(error){
            console.error("Error"+error.message);
            return res.status(500).send("Error al consultar los datos");
        }else{
            console.log('Se elimino el producto del pedido')
            res.json(resultado)
            
        };   
    })
})

module.exports = router;