'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class user extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.User.hasMany(models.);
        }
    }
    user.init({
        emailUser: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        nomUser: {
            type: DataTypes.STRING,
            allowNull: false
        },
        prenomUser: {
            type: DataTypes.STRING,
            allowNull: false
        },
        droitsUser: {
            type: DataTypes.INTEGER,
            allowNull: false,
            default: 0
        },
        mdpUser: {
            type: DataTypes.STRING,
            allowNull: false
        },
        accepteRecevoirAnnonces: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: true
        },
        idTheme: {
            type: DataTypes.INTEGER,
            allowNull: false,
            default: 0
        },
        nomGroupe: {
            type: DataTypes.STRING
        }
    }, {
        sequelize,
        modelName: 'user',
        freezeTableName: true
    });
    return user;
};