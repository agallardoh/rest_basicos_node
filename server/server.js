require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Configuracion global de rutas
app.use(require('./routes/index'));

mongoose.connect('mongodb://localhost:27017/cafe', {

        useNewUrlParser: true,
        useUnifiedTopology: true

    })
    .then(() => console.log('base de datos ONLINE'))
    .catch(err => console.log('No se pudo conectar', err));

app.listen(process.env.port, () => {
    console.log('Escuchando el puerto: ', process.env.port);
});