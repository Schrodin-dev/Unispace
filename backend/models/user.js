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
            user.belongsTo(models.groupe, {foreignKey: {
                name: 'nomGroupe',
                allowNull: false
            }});
            user.belongsTo(models.theme, {foreignkey: {
                name: 'idTheme',
                allowNull: false
            }});
            user.belongsToMany(models.devoir, {
                    foreignKey: {
                    name: 'emailUser'
                },
                through: models.note
            });
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
                    case 1:
                        return 'délégué';
                    case 2:
                        return 'publicateur';
                    case 3:
                        return 'admin';
                }
            },
            set(value){
                switch(value){
                    case 'non validé':
                        this.setDataValue('droitsUser', -1);
                        break;
                    case 'élève':
                        this.setDataValue('droitsUser', 0);
                    break;
                    case 'délégué':
                        this.setDataValue('droitsUser', 1);
                    break;
                    case 'publicateur':
                        this.setDataValue('droitsUser', 2)
                        break;
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