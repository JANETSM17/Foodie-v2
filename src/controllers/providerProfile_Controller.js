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
                const profilePPagePath = path.join(__dirname, '../../public/views/EnterpriseProfile/EProfile/EnterpriseProfile.html');
                res.sendFile(profilePPagePath);
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

router.get('/infoP',(req,res) => {
    const sql = `SELECT * FROM proveedores WHERE id = ${req.session.userID};`
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

router.post('/updateSwitchState', (req, res) => {
    const newState = req.body.state; // Obtener el nuevo estado del cuerpo de la solicitud

    // Actualizar el estado en la base de datos
    const sql = `UPDATE proveedores SET active = ${newState} WHERE id = ${req.session.userID};`;

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


router.post('/changePassword', (req, res) => {
    const previousPass = req.body.previousPass;
    const newPass = req.body.newPass;
    const currentPassQuery = `SELECT contraseña FROM proveedores WHERE id = ${req.session.userID};`;
    const sqlupdate = `UPDATE proveedores SET contraseña = '${newPass}' WHERE id = ${req.session.userID} AND contraseña = '${previousPass}';`;

    db.query(currentPassQuery, (error, results) => {
        if (error) {
            console.error("Error al obtener la contraseña actual:", error.message);
            return res.status(500).send("Error al cambiar la contraseña");
        }
        // Verifica si se obtuvo algún resultado
        if (results.length > 0) {
            const currentPassFromDB = results[0].contraseña;
            // Compara la contraseña actual almacenada en la base de datos con la proporcionada por el usuario
            if (currentPassFromDB === previousPass) {
                db.query(sqlupdate, (error, resultado) => {
                    if (error) {
                        console.error("Error al cambiar la contraseña:", error.message);
                        return res.status(500).send("Error al cambiar la contraseña");
                    } else {
                        if (resultado.affectedRows > 0) {
                            console.log("Contraseña cambiada con éxito");
                            res.sendStatus(200);
                        } else {
                            console.error("La contraseña antigua no coincide1");
                            res.status(400).send("La contraseña antigua no coincide3");
                        }
                    }
                });
            } else {
                console.error("La contraseña antigua no coincide2");
                res.status(400).send("La contraseña antigua no coincide4");
            }
        } else {
            console.error("No se encontró la contraseña actual en la base de datos");
            res.status(500).send("Error al cambiar la contraseña");
        }
    });
});

router.post('/deleteAccount', (req, res) => {
    const enteredPassword = req.body.password;

    // Verifica si la contraseña ingresada coincide con la almacenada en la base de datos
    const checkPasswordQuery = `SELECT contraseña FROM proveedores WHERE id = ${req.session.userID};`;

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
                const deleteAccountQuery = `DELETE FROM proveedores WHERE id = ${req.session.userID};`;

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

router.post('/logout', (req, res) => {
    req.session.userID = null;
    req.session.selectedMenu = null;
    req.session.userType=null;
    res.sendStatus(200);
});

router.post('/updateDatabaseTiempo', (req, res) => {
    const newValue = req.body.newValue;
    // Realiza la actualización del valor en la base de datos
    const sql = `UPDATE proveedores SET min_espera = ${newValue} WHERE id = ${req.session.userID};`;

    db.query(sql, (error, resultado) => {
        if (error) {
            console.error("Error al actualizar el valor en la base de datos:", error.message);
            return res.status(500).send("Error al actualizar el valor en la base de datos");
        } else {
            console.log("Valor actualizado en la base de datos");
            res.sendStatus(200);
        }
    });
});

router.post('/updateDatabaseCodigo', (req, res) => {
    const newCodigo = req.body.newCodigo;
    // Realiza la actualización del valor en la base de datos
    const sql = `UPDATE proveedores SET clave_de_paso = '${newCodigo}' WHERE id = ${req.session.userID};`;

    db.query(sql, (error, resultado) => {
        if (error) {
            console.error("Error al actualizar el código en la base de datos:", error.message);
            return res.status(500).send("Error al actualizar el código en la base de datos");
        } else {
            console.log("Código actualizado en la base de datos");
            res.sendStatus(200);
        }
    });
});

module.exports = router;