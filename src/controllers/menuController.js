const express = require('express');
const db = require('../services/db'); // Importa la configuración de la base de datos
const path = require('path');
const router = express.Router();

async function mandarReseña(idCliente,idProveedor,rating){
    const reseña = await db.query("update","clientes",{_id:db.objectID(idCliente)},{$set:{"proveedores.$[elem].calificacion":rating}},{arrayFilters:[{"elem.id_proveedor":db.objectID(idProveedor)}]})
    return reseña
}

async function obtenerPromedio(idProveedor){
    const promedio = await db.query("aggregation","clientes",[{$unwind:'$proveedores'},{$match:{"proveedores.id_proveedor":db.objectID(idProveedor)}},{$group:{_id:"$proveedores.id_proveedor",calif:{$avg:"$proveedores.calificacion"}}}],)
    console.log(promedio)
    return promedio[0].calif
}

router.use(express.json());

router.get('/', (req, res) => {
    if(!req.session.userID||req.session.userID==null||!req.session.userType||req.session.userType==null){
        res.redirect('/')
    }else{
        switch (req.session.userType) {
            case "cliente":
                const menuPagePath = path.join(__dirname, '../../public/views/Menu/Menu.html');
                console.log('entras a menu')
                console.log('el usuario: '+req.session.userID);
                console.log('entra al menu del comedor: '+req.session.selectedMenu)
                res.sendFile(menuPagePath);
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
router.get('/queCafe', async (req,res) => {
    console.log('inicia el query')
    const info = await db.query("find","proveedores", {_id:db.objectID(req.session.selectedMenu)},{nombre:1,_id:0,calif:1,imagen:1})
    console.log(info)
    res.json(info)
});

router.get('/comida',async (req,res) => {
    console.log('inicia el query')
    const info = await db.query("find","productos",{id_proveedor:db.objectID(req.session.selectedMenu),categoria:"comida"},{imgen:1,nombre:1,descripcion:1,precio:1,_id:1})
    res.json(info)
});

router.get('/bebidas',async (req,res) => {
    console.log('inicia el query')
    const info = await db.query("find","productos",{id_proveedor:db.objectID(req.session.selectedMenu),categoria:"bebidas"},{imgen:1,nombre:1,descripcion:1,precio:1,_id:1})

    res.json(info)
});

router.get('/frituras', async (req,res) => {
    console.log('inicia el query')
    const info = await db.query("find","productos",{id_proveedor:db.objectID(req.session.selectedMenu),categoria:"frituras"},{imgen:1,nombre:1,descripcion:1,precio:1,_id:1})

    res.json(info)
});

router.get('/dulces',async (req,res) => {
    console.log('inicia el query')
    const info = await db.query("find","productos",{id_proveedor:db.objectID(req.session.selectedMenu),categoria:"dulces"},{imgen:1,nombre:1,descripcion:1,precio:1,_id:1})

    res.json(info)
});

router.get('/otros',async (req,res) => {
    console.log('inicia el query')
    const info = await db.query("find","productos",{id_proveedor:db.objectID(req.session.selectedMenu),categoria:"otros"},{imgen:1,nombre:1,descripcion:1,precio:1,_id:1})

    res.json(info)
});

router.get('/confirmar/:id_producto/:idCarrito',async (req,res) => {
    console.log("Confirmando si el producto ya se agrego")
    const id_producto = req.params.id_producto;
    const idCarrito = req.params.idCarrito;
    console.log(idCarrito)
    const info = await db.query("find","pedidos",{_id:db.objectID(idCarrito),"descripcion.producto.id_producto":db.objectID(id_producto)},{_id:1})
    console.log("resultado de la confirmacion:")
    console.log(info)
    res.json(info)
})

router.get('/agregarCarrito/:id_producto/:cantidad/:idCarrito',async (req,res) => {
    const id_producto = req.params.id_producto;
    const cantidad = +req.params.cantidad;
    const id_carrito = req.params.idCarrito;
    console.log('inicia el query')
    const producto = await db.query("find","productos",{_id:db.objectID(id_producto)},{_id:1,nombre:1,precio:1,id_proveedor:1})
    const proveedorProducto = await db.query("find","proveedores",{_id:producto[0].id_proveedor},{correo:1})
    const proveedorPedido = await db.query("find","pedidos",{_id:db.objectID(id_carrito)},{proveedor:1})
    let darAviso = false
    if(proveedorProducto[0].correo!=proveedorPedido[0].proveedor){
        const updatePedido = db.query("update","pedidos",{_id:db.objectID(id_carrito)},{$set:{proveedor:proveedorProducto[0].correo,descripcion:[]}})
        darAviso = (proveedorPedido[0].proveedor != "")
        console.log("DarAviso: "+darAviso)
        console.log(proveedorPedido[0].proveedor)
    }
    const resultado = await db.query("update","pedidos",{_id:db.objectID(id_carrito)},{$push:{descripcion:{producto:{id_producto:db.objectID(id_producto),nombre:producto[0].nombre,precio:producto[0].precio},cantidad: cantidad}}})
    res.json({status:resultado,dar_aviso: darAviso})
    
});

router.post('/calificar', async (req, res) => {
    const rating = req.body.rating;
    const idProveedor = req.session.selectedMenu; 
    const idCliente = req.session.userID;
    console.log("Se hac la reseña") 
    const reseña = await mandarReseña(idCliente,idProveedor,rating)
    console.log(reseña)
    console.log("Se obtiene el promedio")
    const promedio = await obtenerPromedio(idProveedor)
    console.log(promedio)
    console.log("Se hace el update del promedio")
    const update = await db.query("update","proveedores",{_id:db.objectID(idProveedor)},{$set:{calif:promedio}})
    res.status(200).send("Calificación actualizada exitosamente");
});

module.exports = router;