// db.js es la configuración de la base de datos
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'nube2102',
    database: 'foodie'
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión a la base de datos MariaDB establecida');
});

module.exports = db;