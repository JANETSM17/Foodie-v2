const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();

router.get('/ping/:numSerie',async (req,res)=>{
    const {numSerie} = req.params
    const ping = new Date()
    const resultado = await db.query("update","foodieboxes",{numSerie:numSerie},{$set:{ping:ping}},{upsert:true})
    res.json({status:resultado.acknowledged?"todo piola":"todo piolan't"})
})

router.get('/prueba/:clave',async (req,res)=>{
    console.log("Lo detecta")
    const clave = +req.params.clave
    const pedidos = [{clave:"123456", usuario: "Checo", numPedido: "6A6BB8"},{clave:"654321", usuario: "Sifuentes", numPedido: "131313"},{clave:"777777", usuario: "Shanet", numPedido: "ABCABC"}]

    let mandado = false

    pedidos.forEach(pedido=>{
        if(clave==pedido.clave){
            res.json(pedido)
            mandado = true
        }
    })

    if(!mandado){
        res.json({clave:"", usuario: "", numPedido: ""})
    }
})

router.get('/prueba/',async (req,res)=>{
    console.log("Lo detecta")
    const pedidos = [{clave:"123456", usuario: "Checo", numPedido: "6A6BB8"},{clave:"654321", usuario: "Sifuentes", numPedido: "131313"},{clave:"777777", usuario: "Shanet", numPedido: "ABCABC"}]
    res.json(pedidos)
})

module.exports = router;