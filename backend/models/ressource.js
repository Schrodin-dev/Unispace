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
      allowNull: false
    },
    idUE: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: require('./ue'),
        key: 'idUE'
      }
    },
    nomAnneeUniv: {
      type: DataTypes.STRING(2),
      allowNull: false,

      references: {
        model: require('./anneeuniv'),
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