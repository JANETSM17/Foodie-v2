const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    const QAPagePath = path.join(__dirname, '../../public/views/foodiebox/foodiebox.html');
    res.sendFile(QAPagePath);
});

router.get('/ping/:numSerie',async (req,res)=>{
    const {numSerie} = req.params
    const ping = new Date()
    const resultado = await db.query("update","foodieboxes",{numSerie:numSerie},{$set:{ping:ping}},{upsert:true})
    res.json({status:resultado.acknowledged?"todo piola":"todo piolan't"})
})

router.get('/info/:numSerie',async (req,res)=>{
    const {numSerie} = req.params
    const resultado = await db.query("find","foodieboxes",{numSerie:numSerie},{_id:0,clave:1})
    res.json({clave:resultado[0].clave??""})
})

router.get('/pedidoListo/:clave',async (req,res)=>{
    const {clave} = req.params
    console.log("Lo detecta")
    const pedido = await db.query("find","pedidos",{clave:clave},{cliente:1,clave:1,_id:1})
    if(pedido.length>0){
        const setListo = await db.query("update","pedidos",{clave:clave},{$set:{estado:"Listo para recoger"}})
        if(setListo.modifiedCount>0){
            const id = pedido[0]._id.toString()
        res.json({
            usuario: pedido[0].cliente,
            clave: pedido[0].clave,
            numPedido: id.substring(id.length-6,id.length).toUpperCase()
        })
        }else{
            res.json({
                usuario: "",
                clave: "",
                numPedido: ""
            })
        }
    }else{
        res.json({
            usuario: "",
            clave: "",
            numPedido: ""
        })
    }
    
})

router.get('/pedidoEntregado/:clave',async (req,res)=>{
    const {clave} = req.params
    console.log("Lo detecta")
    const pedido = await db.query("find","pedidos",{clave:clave},{cliente:1,clave:1,_id:1})
    if(pedido.length>0){
        const setEntregado = await db.query("update","pedidos",{clave:clave},{$set:{estado:"Entregado",clave:"N/A"}})
        if(setEntregado.modifiedCount>0){
            const id = pedido[0]._id.toString()
        res.json({
            usuario: pedido[0].cliente,
            clave: clave,
            numPedido: id.substring(id.length-6,id.length).toUpperCase()
        })
        }else{
            res.json({
                usuario: "",
                clave: "",
                numPedido: ""
            })
        }
    }else{
        res.json({
            usuario: "",
            clave: "",
            numPedido: ""
        })
    }
})

router.get('/pedidoCancelado/:clave',async (req,res)=>{
    const {clave} = req.params
    console.log("Lo detecta")
    const pedido = await db.query("find","pedidos",{clave:clave},{cliente:1,clave:1,_id:1})
    if(pedido.length>0){
        const setEntregado = await db.query("update","pedidos",{clave:clave},{$set:{estado:"No recogido",clave:"N/A"}})
        if(setEntregado.modifiedCount>0){
            const id = pedido[0]._id.toString()
        res.json({
            usuario: pedido[0].cliente,
            clave: clave,
            numPedido: id.substring(id.length-6,id.length).toUpperCase()
        })
        }else{
            res.json({
                usuario: "",
                clave: "",
                numPedido: ""
            })
        }
    }else{
        res.json({
            usuario: "",
            clave: "",
            numPedido: ""
        })
    }
})

router.get("/ligar/:numSerie",async (req,res)=>{
    const {numSerie} =req.params

    const busqueda = await db.query("find","foodieboxes",{numSerie:numSerie},{_id:0,numSerie:1})
    if(busqueda.length>0){
        const update = await db.query("update","proveedores",{correo:req.session.userMail},{$set:{foodiebox:numSerie}})
        if(update.acknowledged){
            res.json({status:"OK"})
        }else{
            res.json({status:"Failed"})
        }
    }else{
        res.json({status:"Not found"})
    }
})

module.exports = router;