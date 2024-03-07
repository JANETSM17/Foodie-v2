const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = require('./src/routes/index');
const session = require('express-session');

//
app.use(session({//crea el objeto de la sesion y asigna los atributos a usar
    secret:"foodie",//firma de la sesion
    resave: true,
    saveUninitialized:true
}))

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', router);



//

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Se inicio en http://localhost:${port}`);
});
