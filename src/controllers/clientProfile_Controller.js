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

router.get('/infoC',(req,res) => {
    const sql = `SELECT  nombre, correo, telefono, DATE(created_at) as fecha FROM clientes WHERE id = ${req.session.userID};`
    db.query(sql,(error,resultado)=>{
        if(error){
            console.error("Error"+error.message);
            return res.status(500).send("Error al consultar los datos");
        }else{
            console.log("si se pudo")
            res.json(resultado)
            
        };   

    })
});

router.get('/getPedidos',(req,res) => {
    const sql = `SELECT pedidos.id, pedidos.total, pedidos. created_at FROM pedidos WHERE id_cliente = ${req.session.userID};`
    db.query(sql,(error,resultado)=>{
        if(error){
            console.error("Error"+error.message);
            return res.status(500).send("Error al consultar los datos");
        }else{
            console.log("si se pudo")
            res.json(resultado)
            
        };   

    })
});

router.get('/getTotal',(req,res) => {
    const sql = `select SUM(total) as total from pedidos where id_cliente = ${req.session.userID} and id_estado=5`
    db.query(sql,(error,resultado)=>{
        if(error){
            console.error("Error"+error.message);
            return res.status(500).send("Error al consultar los datos");
        }else{
            console.log("si se pudo")
            res.json(resultado)
            
        };   

    })
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

router.get('/getPedidoPendiente',(req,res) => {
    const sql = `select proveedores.ruta as ruta,proveedores.nombre as nombre,pedidos.total as total from pedidos join productos_pedidos on productos_pedidos.id_pedido = pedidos.id join productos on productos_pedidos.id_producto = productos.id join proveedores on proveedores.id = productos.id_proveedor where pedidos.id = (select id from pedidos where id_cliente = ${req.session.userID} and (id_estado = 3 or id_estado = 4))`
    db.query(sql,(error,resultado)=>{
        if(error){
            console.error("Error"+error.message);
            return res.status(500).send("Error al consultar los datos");
        }else{
            console.log("el pedido es:")
            console.log(resultado)
            res.json(resultado)
            
        };   

    })
});

router.get('/getPedidosHist',(req,res) => {
    const sql = `select proveedores.ruta as ruta, pedidos.total as total, pedidos.created_at as hora from pedidos join productos_pedidos on productos_pedidos.id_pedido = pedidos.id join productos on productos_pedidos.id_producto = productos.id join proveedores on proveedores.id = productos.id_proveedor where pedidos.id in (select id from pedidos where id_cliente = ${req.session.userID} and id_estado = 5)`
    db.query(sql,(error,resultado)=>{
        if(error){
            console.error("Error"+error.message);
            return res.status(500).send("Error al consultar los datos");
        }else{
            console.log("el historial es:")
            console.log(resultado)
            res.json(resultado)
            
        };   

    })
});
module.exports = router;