const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = require('./src/routes/index');

//

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
