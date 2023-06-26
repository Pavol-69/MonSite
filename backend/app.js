const express = require("express");
const mongoose = require('mongoose');
const app = express();
const path = require('path');
module.exports = app;
const userRoutes = require('./routes/user');
const deckRoutes = require('./routes/deck');

var bodyParser = require('body-parser');

app.use(express.json());

// Besoin de créer un compte MongoDB, je cache le mdp pour Github
mongoose.connect('mongodb+srv://toto3:<password>@mycluster.z6ej4bo.mongodb.net',

    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion a MongoDB reussie !'))
    .catch(() => console.log('Connexion a MongoDB echouee !'))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/auth', userRoutes);
app.use('/api/deck', deckRoutes);

/*app.post('/api/deck', (req, res, next) => {
    console.log(req.body.name);
    console.log(req.body.userId);
});*/