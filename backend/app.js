const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const auth = require('./middleware/auth');

const userRoutes = require('./routes/user');
const groupeRoutes = require('./routes/groupe');
const mailRoutes = require('./routes/mail');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

require('./controllers/groupe').chargerGroupes();
setInterval(() => require('./controllers/groupe').chargerGroupes(), 5*60*1000);


app.use('/api/auth', userRoutes);
app.use('/api/groupe', auth, groupeRoutes);
app.use('/api/mail', auth, mailRoutes);

module.exports = app;