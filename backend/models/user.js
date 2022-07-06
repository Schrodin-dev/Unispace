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
            default: 0,
            get(){
                switch(this.getDataValue('droitsUser')){
                    case 0:
                        return 'élève';
                    break;
                    case 1:
                        return 'délégué';
                    break;
                    case 2:
                        return 'admin';
                    break;
                }
            },
            set(value){
                switch(value){
                    case 'élève':
                        this.setDataValue('droitsUser', 0);
                    break;
                    case 'délégué':
                        this.setDataValue('droitsUser', 1);
                    break;
                    case 'admin':
                        this.setDataValue('droitsUser', 2);
                    break;
                }
            },
            validate: {
                min: 0,
                max: 2
            }
        },
        mdpUser: {
            type: DataTypes.STRING(128),
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
            type: DataTypes.STRING(2),

            references: {
                model: 'groupe',
                key: 'nomGroupe'
            }
        }
    }, {
        sequelize,
        modelName: 'user',
        freezeTableName: true
    });
    return user;
};