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
                const profilePMenuPagePath = path.join(__dirname, '../../public/views/EnterpriseProfile/EMenu/EMenu.html');
                res.sendFile(profilePMenuPagePath);
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

router.get('/productos',(req,res) => {
    const sql = `SELECT categorias.nombre AS categoria, productos.nombre AS nombre, productos.precio AS precio, productos.descripcion AS descripcion, productos.imagen AS imagen, productos.active AS active, productos.id AS id FROM productos JOIN categorias ON categorias.id=productos.id_categoria WHERE productos.id_proveedor = ${req.session.userID};`
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

router.post('/updateSwitchState/:id', (req, res) => {
    const id = req.params.id;
    const newState = req.body.state; // Obtener el nuevo estado del cuerpo de la solicitud
    // Actualizar el estado en la base de datos
    const sql = `UPDATE productos SET active = ${newState} WHERE id =${id};`;

    db.query(sql, (error, resultado) => {
        if (error) {
            console.error("Error al actualizar el estado en la base de datos:", error.message);
            return res.status(500).send("Error al actualizar el estado en la base de datos");
        } else {
            console.log("Estado actualizado en la base de datos");
            res.sendStatus(200);
        }
    });
});

router.post('/eliminarProducto/:id', (req, res) => {
    const id = req.params.id;

    // Realiza la eliminación del producto en la base de datos
    const sql = `DELETE FROM productos WHERE id = ${id};`;

    db.query(sql, (error, resultado) => {
        if (error) {
            console.error("Error al eliminar el producto en la base de datos:", error.message);
            return res.status(500).send("Error al eliminar el producto en la base de datos");
        } else {
            console.log("Producto eliminado en la base de datos");
            res.sendStatus(200);
        }
    });
});

router.post('/agregarProducto', (req, res) => {
    const newProduct = req.body;
    // Realizar la inserción del nuevo producto en la base de datos
    const sql = `INSERT INTO productos (nombre, precio, descripcion, id_categoria, id_proveedor) VALUES (?, ?, ?, ?, ?);`;

    db.query(sql, [newProduct.nombre, newProduct.precio, newProduct.descripcion, newProduct.id_categoria, req.session.userID], (error, resultado) => {
        if (error) {
            console.error("Error al agregar el nuevo producto en la base de datos:", error.message);
            return res.status(500).send("Error al agregar el nuevo producto en la base de datos");
        } else {
            console.log("Nuevo producto agregado en la base de datos");
            res.sendStatus(200);
        }
    });
});

module.exports = router;