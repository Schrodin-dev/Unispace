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
      primaryKey: true
    },
    nomRessource: {
      type: DataTypes.STRING,
      allowNull: false
    },
    coeffRessource: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    idUE: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nomAnneeUniv: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ressource',
    freezeTableName: true
  });
  return ressource;
};