/*
* ce fichier permet la gestion basique de sequelize
* */

const Sequelize = require('sequelize');
const config = require('./config/config.json');

const databaseConfig = config.development; // nom de la configuration de la base de données dans le fichier config.json

const sequelize = new Sequelize(databaseConfig.database, databaseConfig.username, databaseConfig.password, {
    host: databaseConfig.host,
    dialect: databaseConfig.dialect
});


exports.testConnection = async function() {
    try {
        await sequelize.authenticate();
        console.log('Connection à la base de données établie.');
    } catch (error) {
        console.error('Impossible de se connecter à la base de données:', error);
    }
}