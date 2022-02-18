'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class contenuCours extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  contenuCours.init({
    idContenuCours: DataTypes.INTEGER,
    dateContenuCours: DataTypes.DATE,
    descContenuCours: DataTypes.STRING,
    nomCours: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'contenuCours',
  });
  return contenuCours;
};