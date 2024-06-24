const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    if(!req.session.userID||req.session.userID==null||!req.session.userType||req.session.userType==null){
        res.redirect('/')
    }else{
        switch (req.session.userType) {
            case "cliente":
                const homecPagePath = path.join(__dirname, '../../public/views/bag/bag.html');
                console.log('entras a bolsa')
                console.log(req.session.userID)
                res.sendFile(homecPagePath);
                break;
            
            case "proveedor":
                res.redirect('/homeP');
                break;

            default:
                res.redirect('/')
                break;
        }
    }
});

router.get('/getUsrInfo',async (req,res) => {
    console.log('inicia la consulta del usuario')
    const resultado = await db.query("find","clientes",{_id:db.objectID(req.session.userID)},{nombre:1,telefono:1,_id:0})
    res.json(resultado)
})

router.get('/getProductos/:idCarrito',async (req,res) => {
    console.log('inicia la consulta del carrito')
    const idCarrito = req.params.idCarrito
    console.log(idCarrito)
    const infoProductos = await db.query("aggregation","pedidos",[{$match:{_id:db.objectID(idCarrito)}},{$unwind:"$descripcion"},{$lookup:{from:"productos",localField:"descripcion.producto.id_producto",foreignField:"_id",as:"infoProducto"}},{$project:{_id:0,cantidad:"$descripcion.cantidad",infoProducto:1}},{$unwind:"$infoProducto"},{$project:{cantidad:1,_id:"$infoProducto._id",nombre:"$infoProducto.nombre",precio:"$infoProducto.precio",imagen:"$infoProducto.imagen"}}])

    //const infoProductos = await db.query("find","productos",{_id:{$in:ids[0].ids}},{_id:1,nombre:1,imagen:1,precio:1})

    res.json(infoProductos)
})

router.get('/getPedido',async (req,res) => {
    console.log('inicia el query para obtener el id del carrito')
    const info = await db.query("find","pedidos",{cliente:req.session.userMail,estado:"carrito"},{_id:1})
    console.log("se obtuvo el id del carrito: "+ info[0]._id)
    res.json(info[0]._id)
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

router.get('/actualizarCantidad/:idProducto/:cantidad/:idCarrito',async (req,res) => {
    const idProducto = req.params.idProducto;
    const cantidad = +req.params.cantidad;
    const idCarrito = req.params.idCarrito
    console.log(idProducto)
    console.log(cantidad)
    console.log('Inicia el actualizar')
    resultado = await db.query("update","pedidos",{_id:db.objectID(idCarrito)},{$set:{"descripcion.$[elem].cantidad":cantidad}},{arrayFilters:[{"elem.producto.id_producto":db.objectID(idProducto)}]})
    res.json(resultado)
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

router.get('/quitarProducto/:idProducto/:idCarrito',async (req,res) => {
    const idProducto = req.params.idProducto;
    const idCarrito = req.params.idCarrito
    console.log(idProducto)
    console.log(idCarrito)
    console.log('Inicia la eliminacion del producto del carrito')
    const resultado = await db.query("update","pedidos",{_id:db.objectID(idCarrito)},{$pull:{descripcion:{"producto.id_producto":db.objectID(idProducto)}}})
    res.json(resultado)
})

module.exports = router;