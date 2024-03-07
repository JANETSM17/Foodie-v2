const session = require('express-session')

const conf = session({//crea el objeto de la sesion y asigna los atributos a usar
    secret:"foodie",//firma de la sesion
    resave: true,
    saveUninitialized:true
})