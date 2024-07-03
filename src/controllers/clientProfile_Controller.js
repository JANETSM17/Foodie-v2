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
    res.sendStatus(200);
});

router.post('/deleteAccount', (req, res) => {
    const enteredPassword = req.body.password;

    // Verifica si la contraseña ingresada coincide con la almacenada en la base de datos
    const checkPasswordQuery = `SELECT contraseña FROM clientes WHERE id = ${req.session.userID};`;

    db.query(checkPasswordQuery, (error, results) => {
        if (error) {
            console.error("Error al obtener la contraseña actual:", error.message);
            return res.status(500).send("Error al eliminar la cuenta");
        }

        // Verifica si se obtuvo algún resultado
        if (results.length > 0) {
            const currentPasswordFromDB = results[0].contraseña;

            // Compara la contraseña almacenada con la proporcionada por el usuario
            if (currentPasswordFromDB === enteredPassword) {
                // Realiza la eliminación de la cuenta en la base de datos
                const deleteAccountQuery = `DELETE FROM clientes WHERE id = ${req.session.userID};`;

                db.query(deleteAccountQuery, (error, result) => {
                    if (error) {
                        console.error("Error al eliminar la cuenta:", error.message);
                        return res.status(500).send("Error al eliminar la cuenta");
                    }

                    console.log("Cuenta eliminada con éxito");
                    res.sendStatus(200);
                });
            } else {
                console.error("La contraseña ingresada no coincide con la almacenada");
                res.status(400).send("La contraseña ingresada no coincide");
            }
        } else {
            console.error("No se encontró la contraseña actual en la base de datos");
            res.status(500).send("Error al eliminar la cuenta");
        }
    });
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