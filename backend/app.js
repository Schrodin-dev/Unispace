const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const auth = require('./middleware/auth');

const userRoutes = require('./routes/user');
const groupeRoutes = require('./routes/groupe');
const mailRoutes = require('./routes/mail');
const classeRoutes = require('./routes/classe');
const anneeUnivRoutes = require('./routes/anneeUniv');
const systemeNotationRoutes = require('./routes/systemeNotation');
const travailAFaireRoutes = require('./routes/travailAFaire');
const contenuCoursRoutes = require('./routes/contenuCours');
const travailDeGroupeRoutes = require('./routes/travailDeGroupe');

const corsOptions = {
    origin: require('./config/appli.json').frontend,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', require('./config/appli.json').frontend);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./controllers/groupe').chargerGroupes();
setInterval(() => require('./controllers/groupe').chargerGroupes(), 5*60*1000);
require('./controllers/user').supprimerComptesNonVerifies();
setInterval(() => require('./controllers/user').supprimerComptesNonVerifies(), 24*60*60*1000);


app.use('/api/auth', userRoutes);
app.use('/api/groupe', auth, groupeRoutes);
app.use('/api/mail', auth, mailRoutes);
app.use('/api/classe', auth, classeRoutes);
app.use('/api/anneeUniv', auth, anneeUnivRoutes);
app.use('/api/notation', auth, systemeNotationRoutes);
app.use('/api/travailAFaire', auth, travailAFaireRoutes);
app.use('/api/contenuCours', auth, contenuCoursRoutes);
app.use('/api/travailDeGroupe', auth, travailDeGroupeRoutes);

module.exports = app;