const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    const adminPagePath = path.join(__dirname, '../../public/views/paginaAdmin/admin.html');
    res.sendFile(adminPagePath);
});

//obtiene los datos de los comentarios desde la base de datos
router.get('/comentarios', async (req, res) => {
    const info = await db.query("aggregation","comentarios",[{$sort:{"created_at":-1}}])
    let resultado = []
    info.forEach(comentario=>{
        resultado.push({
            nombre: comentario.nombre,
            correo: comentario.correo,
            telefono: comentario.telefono,
            mensaje: comentario.mensaje,
            fecha: comentario.created_at.toLocaleString()
        })
    })
    res.json(resultado)
});

//elimina un comedor al proporcionar su nombre
router.post('/quitarComedor',async (req,res)=>{
    const correo = req.body.correo;
    const resultado = await db.query("deleteOne", "proveedores",{correo:correo})
    if(resultado.acknowledged){
        res.sendStatus(200);
    }else{
        return res.status(500).send("Error al eliminar el comedor");
    }
});

//elimina un usuario al proporcionar su correo
router.post('/quitarCliente',async (req,res)=>{
    const correo = req.body.correo;
    const resultado = await db.query("deleteOne", "clientes",{correo:correo})
    if(resultado.acknowledged){
        res.sendStatus(200);
    }else{
        return res.status(500).send("Error al eliminar el comedor");
    }
});


module.exports = router;