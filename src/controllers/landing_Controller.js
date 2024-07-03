const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    const landingPagePath = path.join(__dirname, '../../public/views/Landing/Landing.html');
    res.sendFile(landingPagePath);
});

router.post('/comentar', async (req, res) => {
    const { nombre, correo, telefono, mensaje} = req.body;
    // Insertar el usuario en la base de dato
    const resultado = await db.query("insert","comentarios",{nombre:nombre,correo:correo,telefono:telefono,mensaje:mensaje,created_at:new Date()})
    res.json({resultado})
});

module.exports = router;