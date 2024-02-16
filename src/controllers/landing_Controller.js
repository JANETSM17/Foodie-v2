const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    const landingPagePath = path.join(__dirname, '../../public/views/Landing/Landing.html');
    res.sendFile(landingPagePath);
});

router.post('/comentar', (req, res) => {
    const { nombre, correo, telefono, mensaje} = req.body;
    // Insertar el usuario en la base de dato
    const sql = 'INSERT INTO comentarios (nombre,  correo, telefono, mensaje) VALUES (?, ?, ?, ?)';
      db.query(sql, [nombre, correo, telefono, mensaje], (err, results) => {
        if (err) {
            console.error('Error al registrar el comentario: ' + err.message);
            res.send('No registrado con exito');
        } else {
            console.log('Comentario registrado con éxito');
            res.send('Registrado con exito');
        }
    });  
});

module.exports = router;