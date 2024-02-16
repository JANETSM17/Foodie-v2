var idUser;//variable para el ID del usuario activo
var idMenu;//variable para saber que menu mostrarle al cliente

//funcion para obtener el valor de idUser
function getID(){
    return idUser;
}

//funcion para cambiar el valor de idUser
function setID(nID){
    idUser=nID;
}

//funcion para obtener el valor de idMenu
function getMenu(){
    return idMenu;
}

//funcion para cambiar el valor de idUMenu
function setMenu(nID){
    idMenu=nID;
}

module.exports = {
    getID,
    setID,
    getMenu,
    setMenu
};