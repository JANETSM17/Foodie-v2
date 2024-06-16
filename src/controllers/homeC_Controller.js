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
    if(!req.session.userID||req.session.userID==null||!req.session.userType||req.session.userType==null){
        res.redirect('/')
    }else{
        switch (req.session.userType) {
            case "cliente":
                const homecPagePath = path.join(__dirname, '../../public/views/homeC/homec.html');
                console.log('entras a homeC')
                console.log(req.session.userID)
                res.sendFile(homecPagePath);
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

router.get('/comedores',async (req,res) => {
    console.log('inicia el query para mostrar los comedores')
    const respuesta = await db.query("find","clientes",{_id:db.objectID(req.session.userID)},{"proveedores.id_proveedor":1,_id:0})
    let idsComedores = []
    if(respuesta[0].proveedores.length>0){
        respuesta[0].proveedores.forEach(comedor => {
            idsComedores.push(comedor.id_proveedor)
        })
        console.log("mostrando correos:")
        console.log(idsComedores)
        console.log("Buscando comedores:")
        const info = await db.query("find","proveedores",{_id:{$in:idsComedores}},{_id:1,nombre:1,calif:1,min_espera:1,imagen:1,active:1})
        
        
       res.json(info)
    }else{
        res.json({})
    }
});

router.post('/agregarComedor', async (req,res)=>{
    const codigo = req.body.campoCodigo;
    const comedor = await db.query("find","proveedores",{clave:codigo},{_id:1})
    const confirmComedor = await db.query("find","clientes",{_id:db.objectID(req.session.userID),"proveedores.id_comedor":comedor[0]._id},{id:1})
    if(confirmComedor.length==0){
        if(comedor.length>0){ 
            console.log(comedor)
            const result = await db.query("update","clientes",{_id:db.objectID(req.session.userID)},{$push:{proveedores:{id_proveedor:comedor[0]._id,calificacion:0}}})
            console.log(result)
            res.redirect('/login/homeC')
        }else{
            console.log("No existe un comedor con esa clave")
            res.redirect('/login/homeC')
        }
    }else{
        console.log("Ya tienes este comedor agregado")
        res.redirect('/login/homeC')
    }
});

router.get('/borrarComedor/:id',async (req,res)=>{
    const id = req.params.id;
    const resultado = await db.query("update","clientes",{_id:db.objectID(req.session.userID)},{$pull:{proveedores:{id_proveedor:db.objectID(id)}}})
    console.log('id='+id)
    console.log('global='+req.session.userID)
    res.json({resultado})
})

router.get('/setMenu/:id',(req,res)=>{
    console.log('se actualiza el menu')
    const id = req.params.id;
    req.session.selectedMenu = id;
    if(!req.session.selectedMenu){
        console.log("selectedMenu no existe wey....")
        res.json({mensaje: "no se armo"})
    }else{
       console.log("El menu seleccionado es: "+req.session.selectedMenu)
       res.json({mensaje: "si se armo"}) 
    }
    
})

router.use('/menu',menuController);
router.use('/bag',bagController);
router.use('/pedidos',confirmController);
router.use('/contactC', contactCController);
router.use('/perfilCliente', profileCController);
router.use('/QA', QAController);

module.exports = router;
//res.send('Llegaste a home Cliente');