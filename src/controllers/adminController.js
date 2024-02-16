const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    const adminPagePath = path.join(__dirname, '../../frontend/vistas/paginaAdmin/admin.html');
    res.sendFile(adminPagePath);
});

//obtiene los datos de los comentarios desde la base de datos
router.get('/comentarios', (req, res) => {
    const sql = "select nombre, correo, telefono, mensaje, created_at as fecha from comentarios";
    db.query(sql,(error,resultado)=>{
        if(error){
            console.error("Error"+error.message);
            return res.status(500).send("Error al consultar los datos");
        }else{
            console.log("si se pudo")
            console.log(resultado)
        res.json(resultado);
        };   
    })
});

//elimina un comedor al proporcionar su nombre
router.post('/quitarComedor',(req,res)=>{
    const nombre = req.body.nombre;
    const sql = "delete from proveedores where nombre = ?";
    db.query(sql,nombre,(error)=>{
        if(error){
            console.error("No jalo el delete "+error.message)
        }else{
            console.log("si se pudo borrar");
            res.redirect('/admin')
        }
    })
});

//elimina un usuario al proporcionar su correo
router.post('/quitarCliente',(req,res)=>{
    const correo = req.body.correo;
    const sql = "delete from clientes where correo = ?";
    db.query(sql,correo,(error)=>{
        if(error){
            console.error("No jalo el delete "+error.message)
        }else{
            console.log("si se pudo borrar");
            res.redirect('/admin')
        }
    })
});


module.exports = router;