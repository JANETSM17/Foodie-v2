const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();
const profilePController = require('./providerProfile_Controller');
const contactUsEController = require("./contactUsE_Controller")

router.get('/', (req, res) => {
    if(!req.session.userID||req.session.userID==null||!req.session.userType||req.session.userType==null){
        res.redirect('/')
    }else{
        switch (req.session.userType) {
            case "proveedor":
                const homepPagePath = path.join(__dirname, '../../public/views/homeP/homep.html');
                res.sendFile(homepPagePath);
                break;
            
            case "cliente":
                res.redirect('/homeC');
                break;

            default:
                res.redirect('/')
                break;
        }
    }
});

router.get('/pedidos',async (req,res)=>{
    const estados = ["Esperando confirmacion","En proceso","Listo para recoger"]
    const infoPedidos = await db.query("aggregation","pedidos",[{$match:{proveedor:req.session.userMail, estado:{$in:estados}}},{$lookup:{from:"clientes",localField:"cliente",foreignField:"correo",as:"infoCliente"}}])
    let resultado = []
    infoPedidos.forEach(pedido=>{
        let total = 0
        let descripcion = ""
        pedido.descripcion.forEach(articulo=>{
            total += (articulo.producto.precio*articulo.cantidad)
            descripcion += `${articulo.producto.nombre} x${articulo.cantidad},`
        })
        descripcion = descripcion.slice(0,-1)
        let id = pedido._id.toString()

        resultado.push({
            id: id,
            numerodepedido:id.substring(id.length-6,id.length).toUpperCase(),
            nombre: pedido.infoCliente[0].nombre,
            telefono: pedido.infoCliente[0].telefono,
            especificaciones: pedido.especificaciones,
            total: total,
            descripcion: descripcion,
            entrega: pedido.entrega.toLocaleString(),
            pickup: pedido.pickup=="mostrador"?"Mostrador":"Foodiebox",
            clave: pedido.clave,
            estado: pedido.estado
        })
    })
    res.json(resultado)
})

router.get('/pedidos/:estado',async (req,res)=>{
    const estado = decodeURI(req.params.estado)
    const infoPedidos = await db.query("aggregation","pedidos",[{$match:{proveedor:req.session.userMail, estado: estado}},{$lookup:{from:"clientes",localField:"cliente",foreignField:"correo",as:"infoCliente"}}])
    let resultado = []
    infoPedidos.forEach(pedido=>{
        let total = 0
        let descripcion = ""
        pedido.descripcion.forEach(articulo=>{
            total += (articulo.producto.precio*articulo.cantidad)
            descripcion += `${articulo.producto.nombre} x${articulo.cantidad},`
        })
        descripcion = descripcion.slice(0,-1)
        let id = pedido._id.toString()

        resultado.push({
            id: id,
            numerodepedido:id.substring(id.length-6,id.length).toUpperCase(),
            nombre: pedido.infoCliente[0].nombre,
            telefono: pedido.infoCliente[0].telefono,
            especificaciones: pedido.especificaciones,
            total: total,
            descripcion: descripcion,
            entrega: pedido.entrega.toLocaleString(),
            pickup: pedido.pickup,
            clave: pedido.clave
        })
    })
    res.json(resultado)
})

router.get('/pedidoListo/:id',async (req,res)=>{
    const id = req.params.id;
    const resultado = await db.query("update","pedidos",{_id:db.objectID(id)},{$set:{estado:"Listo para recoger"}})
    res.json({status: "done"})
})

router.get('/pedidoEntregado/:id',async (req,res)=>{
    const id = req.params.id;
    const resultado = await db.query("update","pedidos",{_id:db.objectID(id)},{$set:{estado:"Entregado"}})
    res.json({status: "done"})
})

router.use('/perfilProveedor', profilePController);
router.use('/contactP', contactUsEController);
module.exports = router;