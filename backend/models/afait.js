'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class aFait extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  aFait.init({
    nomGroupe: DataTypes.STRING,
    idContenuCours: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'aFait',
  });
  return aFait;
};