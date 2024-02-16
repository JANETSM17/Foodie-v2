const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();
const globals = require('../services/globals');

router.get('/', (req, res) => {
    const profilePQAPagePath = path.join(__dirname, '../../public/views/EnterpriseProfile/Q&A/Q&A.html');
    res.sendFile(profilePQAPagePath);
});

module.exports = router;