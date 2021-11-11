const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

const userRoutes = require('./routes/user');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "noobnote"
});

db.connect((err) =>{
    if(err) throw err;
    console.log("connecté à la base de données");
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(bodyParser.json());

app.use('/users', userRoutes);

module.exports = app;