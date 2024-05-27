const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
    if(!req.session.userID||req.session.userID==null||!req.session.userType||req.session.userType==null){
        res.redirect('/')
    }else{
        switch (req.session.userType) {
            case "cliente":
                const menuPagePath = path.join(__dirname, '../../public/views/Menu/Menu.html');
                console.log('entras a menu')
                console.log('el usuario: '+req.session.userID);
                console.log('entra al menu del comedor: '+req.session.selectedMenu)
                res.sendFile(menuPagePath);
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
router.get('/queCafe',(req,res) => {
    console.log('inicia el query')
    const sql = `select * from proveedores where id = ${req.session.selectedMenu}`
    db.query(sql,(error,resultado)=>{
        if(error){
            console.error("Error"+error.message);
            return res.status(500).send("Error al consultar los datos");
        }else{
            console.log("si se pudo")
            console.log(resultado)
            res.json(resultado)
            
        };   

    })
});

router.get('/comida',(req,res) => {
    console.log('inicia el query')
    const sql = `select * from productos where id_proveedor = ${req.session.selectedMenu} and id_categoria = 1`
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

router.get('/bebidas',(req,res) => {
    console.log('inicia el query')
    const sql = `select * from productos where id_proveedor = ${req.session.selectedMenu} and id_categoria = 2`
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

router.get('/frituras',(req,res) => {
    console.log('inicia el query')
    const sql = `select * from productos where id_proveedor = ${req.session.selectedMenu} and id_categoria = 3`
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

router.get('/dulces',(req,res) => {
    console.log('inicia el query')
    const sql = `select * from productos where id_proveedor = ${req.session.selectedMenu} and id_categoria = 4`
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

router.get('/otros',(req,res) => {
    console.log('inicia el query')
    const sql = `select * from productos where id_proveedor = ${req.session.selectedMenu} and id_categoria = 5`
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

router.get('/confirmar/:id_producto/:idCarrito',(req,res) => {
    const id_producto = req.params.id_producto;
    const idCarrito = req.params.idCarrito;
    console.log('inicia la confirmacion')
    const sql = `select count(*) as cuenta from productos_pedidos where id_producto = ${id_producto} and id_pedido = ${idCarrito}`
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

router.get('/agregarCarrito/:id_producto/:cantidad/:idCarrito',(req,res) => {
    const id_producto = req.params.id_producto;
    const cantidad = req.params.cantidad;
    const idCarrito = req.params.idCarrito;
    console.log('inicia el query')
    const sql = `insert into productos_pedidos (id_producto,id_pedido,cantidad) values (${id_producto},${idCarrito},${cantidad})`
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

router.post('/calificar', (req, res) => {
    const rating = req.body.rating;
    const idProveedor = req.session.selectedMenu; 
    const idCliente = req.session.userID; 

    const sql = `CALL reseña(${idProveedor}, ${idCliente}, ${rating})`;

    db.query(sql, (error, resultado) => {
        if (error) {
            console.error("Error" + error.message);
            return res.status(500).send("Error al actualizar la calificación en la base de datos");
        } else {
            console.log("Calificación actualizada exitosamente");
            res.status(200).send("Calificación actualizada exitosamente");
        }
    });
});

module.exports = router;