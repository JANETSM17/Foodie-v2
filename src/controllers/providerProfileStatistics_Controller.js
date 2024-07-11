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
                const profilePStatisticsPagePath = path.join(__dirname, '../../public/views/EnterpriseProfile/Estadisticas/Estadisticas.html');
                res.sendFile(profilePStatisticsPagePath);
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

router.get('/infoProductos',async (req,res) => {
    console.log('obtenemos las estadisticas')
    const semanaPasada = new Date()
    semanaPasada.setDate(semanaPasada.getDate()-7)
    const productosInfo = await db.query("aggregation","pedidos",[{$match:{proveedor:req.session.userMail,estado:"Entregado",entrega:{$gte:semanaPasada}}},{$unwind:"$descripcion"},{$project:{id_producto:"$descripcion.producto.id_producto",cantidad:"$descripcion.cantidad",_id:0}},{$lookup:{from:"productos",localField:"id_producto",foreignField:"_id",as:"producto"}},{$project:{id:"$id_producto",cantidad:1,nombre:"$producto.nombre",categoria:"$producto.categoria"}},{$unwind:"$nombre"},{$unwind:"$categoria"},{$group:{_id:"$id",nombre:{$first:"$nombre"},categoria:{$first:"$categoria"},cantidad:{$sum:"$cantidad"}}},{$sort:{cantidad:-1}}])
    let resultado = []
    productosInfo.forEach(producto=>{
        let id = producto._id.toString()
        resultado.push({
            id:id.substring(id.length-4,id.length),
            nombre:producto.nombre,
            categoria:producto.categoria,
            cantidad:producto.cantidad
        })
    })
    res.json(resultado)
});

router.get('/ventaSemana',async (req,res) => {
    console.log('obtenemos el total de la semana')
    const semanaPasada = new Date()
    semanaPasada.setDate(semanaPasada.getDate()-7)
    let total = 0
    const pedidosInfo = await db.query("aggregation","pedidos",[{$match:{proveedor:req.session.userMail,estado:"Entregado",proveedor:req.session.userMail,entrega:{$gte:semanaPasada}}},{$project:{descripcion:1,_id:0}}])
    pedidosInfo.forEach(pedido=>{
        let precio = 0
        pedido.descripcion.forEach(articulo=>{
            precio += (articulo.producto.precio*articulo.cantidad)
        })
        total += precio
    })
    res.json({total:total})
});

module.exports = router;