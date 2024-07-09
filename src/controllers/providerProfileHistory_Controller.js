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
                const profilePHistoryPagePath = path.join(__dirname, '../../public/views/EnterpriseProfile/HistorialPedidos/HP.html');
                res.sendFile(profilePHistoryPagePath);
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

router.get('/getPedidosHist',async (req,res) => {
    const sql = `select distinct pedidos.id as id, clientes.ruta as ruta,clientes.nombre as nombre,pedidos.descripcion as descripcion, pedidos.created_at as hora, pedidos.total as total from clientes join pedidos on pedidos.id_cliente = clientes.id join productos_pedidos on productos_pedidos.id_pedido = pedidos.id join productos on productos.id = productos_pedidos.id_producto join proveedores on productos.id_proveedor = proveedores.id where proveedores.id = ${req.session.userID}`
    const estados = ["Entregado"]
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
        let id = pedido._id.inspect()

        resultado.push({
            numerodepedido:id.substring(id.length-8,id.length-2).toUpperCase(),
            nombre: pedido.infoCliente[0].nombre,
            total: total,
            descripcion: descripcion,
            hora: pedido.entrega.toLocaleString(),
            ruta : pedido.infoCliente[0].imagen
        })
    })
    res.json(resultado)
});

module.exports = router;