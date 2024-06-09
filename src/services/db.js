// db.js es la configuración de la base de datos
const { MongoClient, ObjectId} = require('mongodb')
const url = 'mongodb+srv://Admin:FOODIE@clusterfoodie.10j4aom.mongodb.net/'
const client = new MongoClient(url)

const dbName = 'foodie'

async function con(){
    console.log("inicia la funcion")
    await client.connect()
    console.log("conectado chido")
    const database = client.db(dbName)
    const cli = await database.collection('clientes').find().toArray()
    console.log(cli[0]._id)
}

function objectID(id){
    let ID = new ObjectId(id)
    return ID
}

async function query(type,collection,primaryObject,secondaryObject) {
    await client.connect()
    console.log("conexion lograda")
    const database = client.db(dbName)
    let res
    switch (type) {
        case "insert":
            res = await database.collection(collection).insertOne(primaryObject)
            await client.close()
            await console.log(res)
            return res

        case "deleteOne":
            res = await database.collection(collection).deleteOne(primaryObject)
            await client.close()
            await console.log(res)
            return res

        case "update":
            res = await database.collection(collection).updateOne(primaryObject,secondaryObject)
            await client.close()
            await console.log(res)
            return res

        case "find":
            res = await database.collection(collection).find(primaryObject).project(secondaryObject).toArray()
            await client.close()
            return res
        case "agregation":
            
            break;

        default:
            break;
    }
}

con()
.catch(console.error)
.finally(()=>client.close())



const db ={
    "client":client,
    "database": this.database
}
module.exports = {query,objectID};