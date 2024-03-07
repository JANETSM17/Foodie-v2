const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();
const menuController = require('./menuController');
const bagController = require('./bagController')
const confirmController = require('./confirmacionController')
const contactCController = require('./contactUsC_Controller');
const profileCController = require('./clientProfile_Controller');
const QAController = require('./QA_Controller');

router.get('/', (req, res) => {
    const homecPagePath = path.join(__dirname, '../../public/views/homeC/homec.html');
    console.log('entras a homeC')
    console.log(req.session.userID)
    res.sendFile(homecPagePath);
});

router.get('/comedores',(req,res) => {
    console.log('inicia el query')
    const sql = `select * from proveedores where id in (select id_proveedor from proveedores_clientes where id_cliente = ${req.session.userID})`
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

router.post('/agregarComedor', (req,res)=>{
    const codigo = req.body.campoCodigo;
    const sql = `insert into proveedores_clientes (id_proveedor, id_cliente) values ((select id from proveedores where clave_de_paso ='${codigo}'),${req.session.userID}) `;
    db.query(sql,(error)=>{
        if(error){
            console.error("No funciono el insert "+error.message)
        }else{
            console.log("si se pudo enlazar el comedor");
            res.redirect('/login/homeC')
        }
    })
});

router.get('/borrarComedor/:id',(req,res)=>{
    const id = req.params.id;
    const sql = `delete from proveedores_clientes where id_proveedor = ${id} AND id_cliente = ${req.session.userID}`
    console.log('id='+id)
    console.log('global='+req.session.userID)
    db.query(sql,(error)=>{
        if(error){
            console.error("No funciono el delete "+error.message)
        }else{
            console.log("si se pudo eliminar el enlace");
        }
    })
})

router.get('/setMenu/:id',(req,res)=>{
    console.log('se actualiza el menu')
    const id = req.params.id;
    req.session.selectedMenu = id;
})

router.use('/menu',menuController);
router.use('/bag',bagController);
router.use('/pedidos',confirmController);
router.use('/contactC', contactCController);
router.use('/perfilCliente', profileCController);
router.use('/QA', QAController);

module.exports = router;
//res.send('Llegaste a home Cliente');