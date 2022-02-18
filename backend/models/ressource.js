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
    idRessource: DataTypes.INTEGER,
    nomRessource: DataTypes.STRING,
    coeffRessource: DataTypes.FLOAT,
    idUE: DataTypes.INTEGER,
    nomAnneeUniv: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ressource',
  });
  return ressource;
};