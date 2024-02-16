const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    const QAPagePath = path.join(__dirname, '../../public/views/QA/qa.html');
    res.sendFile(QAPagePath);
});

module.exports = router;