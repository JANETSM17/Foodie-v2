const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();

function crearClave() {
    const caracteres = '0123456789';//para generar la clave para recoger el pedido en el foodiebox
    let clave=""
    for (let i = 0; i < 6; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
        clave += caracteres.charAt(indiceAleatorio);
        
    }

    return clave
}

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
    const info = await db.query("find","pedidos",{cliente:req.session.userMail,estado:"Carrito"},{_id:1,proveedor:1})
    console.log("se obtuvo el id del carrito: "+ info[0]._id)
    res.json({id:info[0]._id,proveedor:info[0].proveedor})
})

router.get('/enviarPedido/:id/:espera/:especificaciones/:pickup',async (req,res) => {
    const id = req.params.id
    const espera = +req.params.espera
    const especificaciones = decodeURI(req.params.especificaciones)
    const pickup = req.params.pickup
    let clave 
    if(pickup=="mostrador"){
        clave = "N/A"
    }else{
        const clavesEnUso = await db.query("find","pedidos",{},{clave:1,_id:0})
        clave = crearClave()
        while(clavesEnUso.some(elem=>elem.clave == clave)){
            clave = crearClave()
        }
    }
    
    console.log('inicia el envio del pedido')
    let date = new Date()
    console.log(date)
    date.setMinutes(date.getMinutes()+espera)
    console.log(date)
    const resultado = await db.query("update","pedidos",{_id:db.objectID(id)},{$set:{estado:"En proceso",entrega:date,especificaciones:especificaciones,pickup:pickup,clave:clave}})
    const nuevoCarrito = await db.query("insert","pedidos",{cliente:req.session.userMail,estado:"Carrito",proveedor:"",especificaciones:"",descripcion:[],especificaciones:""})
    console.log(nuevoCarrito)
    res.json(resultado)
})

router.get('/confirmar',async (req,res) => {
    console.log('inicia la confirmacion')
    const estados = ["En proceso","Listo para recoger"]
    const resultado = await db.query("find","pedidos",{cliente:req.session.userMail,estado:{$in:estados}})
    console.log(resultado.length)
    res.json({cuenta:resultado.length})
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

router.get('/confirmarFoodieBox/:proveedor',async (req,res)=>{
    const {proveedor} = req.params
    let dateLimit = new Date()
    dateLimit.setMinutes(dateLimit.getMinutes()-5)
    const ping = await db.query("aggregation","proveedores",[{$match:{correo:proveedor}},{$lookup:{from:"foodieboxes",localField:"foodiebox",foreignField:"numSerie",as:"infoFoodieBox"}},{$project:{ping:"$infoFoodieBox.ping"}},{$unwind:"$ping"}])
    console.log("ping recibido")
    if(ping.length>0){
        console.log({status:  ping[0].ping>dateLimit})
        res.json({status:  ping[0].ping>dateLimit})
    }else{
        res.json({status:  false})
    }
})

router.get('/confirmarEspera/:idCarrito',async(req,res) => {
    const carrito = req.params.idCarrito
    console.log('inicia la confirmacion del tiempo de espera')
    const resultado = await db.query("aggregation","pedidos",[{$match:{_id:db.objectID(carrito)}},{$lookup:{from:"proveedores",localField:"proveedor",foreignField:"correo",as:"proveedorInfo"}},{$project:{min_espera:"$proveedorInfo.min_espera"}}])
    res.json(resultado)
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