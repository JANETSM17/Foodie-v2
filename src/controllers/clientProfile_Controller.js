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
                const profilePPagePath = path.join(__dirname, '../../public/views/CostumerProfile/CustomerProfile.html');
                res.sendFile(profilePPagePath);
                break;
            
            case "proveedor":
                res.redirect('/providerProfile');
                break;

            default:
                res.redirect('/')
                break;
        }
    }
});

router.get('/infoC',async (req,res) => {
    const resultado = await db.query("find","clientes",{correo:req.session.userMail},{_id:0,nombre:1,correo:1,telefono:1,fecha:'$created_at'})
    res.json(resultado)
    
});

router.post('/logout', (req, res) => {
    req.session.userID = null;
    req.session.selectedMenu = null;
    req.session.userType=null;
    req.session.userMail=null;
    res.sendStatus(200);
});

router.post('/deleteAccount', async (req, res) => {
    const enteredPassword = req.body.password;

    //borra la cuenta que coincida en id y contraseña
    const resultado = await db.query("deleteOne","proveedores",{_id:db.objectID(req.session.userID),"contraseña":enteredPassword})
    if(resultado.deletedCount>0){
        res.sendStatus(200);
    }else{
        return res.status(500).send("Error al borrar la cuenta");
    }
});

router.get('/getPedidoPendiente',async (req,res) => {
    const estados = ["En proceso","Listo para recoger"]
    const pedidosInfo = await db.query("aggregation","pedidos",[{$match:{cliente:req.session.userMail,estado:{$in:estados}}},{$lookup:{from:"proveedores",localField:"proveedor",foreignField:"correo",as:"infoProveedor"}},{$project:{descripcion:1,entrega:1,"infoProveedor.imagen":1,_id:0}}])
    let resultado = []
    pedidosInfo.forEach(pedido=>{
        let total = 0
        pedido.descripcion.forEach(articulo=>{
            total += (articulo.producto.precio*articulo.cantidad)
        })
        resultado.push(
            {
                total: total,
                hora: pedido.entrega.toLocaleString(),
                ruta:pedido.infoProveedor[0].imagen
            }
        )
    })
    res.json(resultado)
});

router.get('/getPedidosHist',async (req,res) => {
    const sql = `select proveedores.ruta as ruta, pedidos.total as total, pedidos.created_at as hora from pedidos join productos_pedidos on productos_pedidos.id_pedido = pedidos.id join productos on productos_pedidos.id_producto = productos.id join proveedores on proveedores.id = productos.id_proveedor where pedidos.id in (select id from pedidos where id_cliente = ${req.session.userID} and id_estado = 5)`
    const estados=["Entregado"]
    const pedidosInfo = await db.query("aggregation","pedidos",[{$match:{cliente:req.session.userMail,estado:{$in:estados}}},{$lookup:{from:"proveedores",localField:"proveedor",foreignField:"correo",as:"infoProveedor"}},{$project:{estado:1,descripcion:1,entrega:1,"infoProveedor.imagen":1,_id:0}},{$sort:{entrega:-1}}])
    let resultado = []
    let total = 0
    pedidosInfo.forEach(pedido=>{
        let precio = 0
        pedido.descripcion.forEach(articulo=>{
            precio += (articulo.producto.precio*articulo.cantidad)
        })
        total += precio
        resultado.push(
            {
                total: precio,
                hora: pedido.entrega.toLocaleString(),
                ruta:pedido.infoProveedor[0].imagen
            }
        )
    })
    res.json({res:resultado,total:total})
});
module.exports = router;