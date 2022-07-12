'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ressource extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ressource.belongsTo(models.UE);
      ressource.belongsTo(models.anneeUniv);
    }
  }
  ressource.init({
    idRessource: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nomRessource: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    coeffRessource: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min(value){
          if(value <= 0){
            throw new Error('le coefficient doit être supérieur à 0.');
          }
        },
        max: 100
      }
    },
    idUE: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: 'ue',
        key: 'idUE'
      }
    },
    nomAnneeUniv: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: 'anneeUniv',
        key: 'nomAnneeUniv'
      }
    }
  }, {
    sequelize,
    modelName: 'ressource',
    freezeTableName: true
  });
  return ressource;
};