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
                const homecPagePath = path.join(__dirname, '../../public/views/confirmacionPedido/confirmacion.html');
                console.log('entras a confirmacion')
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
router.get('/pedidosEnCurso',async (req,res) => {
    console.log('inicia el query')
    const userInfo = await db.query("find","clientes",{_id:db.objectID(req.session.userID)},{nombre:1,telefono:1,_id:0})
    const estados = ["Esperando confirmacion","En proceso","Listo para recoger","Cancelado"]
    const pedidoInfo = await db.query("aggregation","pedidos",[{$match:{cliente: req.session.userMail,estado:{$in:estados}}},{$sort:{entrega:-1}},{$limit:1},{$lookup:{from:"proveedores",localField:"proveedor",foreignField:"correo",as:"infoProveedor"}},{$project:{_id:1,especificaciones:1,descripcion:1, entrega:1,estado:1,clave:1,pickup:1,nombre:"$infoProveedor.nombre",telefono:"$infoProveedor.telefono"}},{$unwind:"$nombre"},{$unwind:"$telefono"}])
    let resultado = []
    pedidoInfo.forEach(pedido=>{
        let total = 0
        let descripcion = ""
        pedido.descripcion.forEach(articulo=>{
            total += (articulo.producto.precio*articulo.cantidad)
            descripcion += `${articulo.producto.nombre} x${articulo.cantidad},`
        })
        descripcion = descripcion.slice(0,-1)
        let id = pedido._id.inspect()
        resultado.push(
            {
                id:id.substring(id.length-8,id.length-2).toUpperCase(),
                nombre: pedido.nombre,
                telefono: pedido.telefono,
                especificaciones: pedido.especificaciones,
                total: total,
                descripcion: descripcion,
                entrega: pedido.entrega.toLocaleString(),
                status: pedido.estado,
                clave: pedido.clave,
                pickup: pedido.pickup=="mostrador"?"Mostrador":"Foodie-box"
            }
        )
    })
    res.json(resultado)
});

module.exports = router;