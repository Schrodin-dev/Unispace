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
        }
    }
    user.init({
        emailUser: {
            type: DataTypes.STRING(128),
            primaryKey: true
        },
        nomUser: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
        prenomUser: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
        droitsUser: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: -1,
            get(){
                switch(this.getDataValue('droitsUser')){
                    case -1:
                        return 'non validé'
                    case 0:
                        return 'élève';
                    break;
                    case 1:
                        return 'délégué';
                    break;
                    case 2:
                        return 'publicateur';
                    break;
                    case 3:
                        return 'admin';
                    break;
                }
            },
            set(value){
                switch(value){
                    case 'non validé':
                        this.setDataValue('droitsUser', -1);
                    case 'élève':
                        this.setDataValue('droitsUser', 0);
                    break;
                    case 'délégué':
                        this.setDataValue('droitsUser', 1);
                    break;
                    case 'publicateur':
                        this.setDataValue('droitsUser', 2)
                    case 'admin':
                        this.setDataValue('droitsUser', 3);
                    break;
                }
            },
            validate: {
                min: -1,
                max: 3
            }
        },
        mdpUser: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        accepteRecevoirAnnonces: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        idTheme: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0 //TODO: manque une clé étrangère là
        },
        nomGroupe: {
            type: DataTypes.STRING(4),

            references: {
                model: 'groupe',
                key: 'nomGroupe'
            }
        },
        codeVerification: {
            type: DataTypes.UUID
        },
        expirationCodeVerification: {
            type: DataTypes.DATE
        }
    }, {
        sequelize,
        modelName: 'user',
        freezeTableName: true
    });
    return user;
};