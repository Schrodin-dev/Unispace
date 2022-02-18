'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class travailAFaire extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  travailAFaire.init({
    idTravailAFaire: DataTypes.INTEGER,
    dateTravailAFaire: DataTypes.DATE,
    descTravailAFaire: DataTypes.STRING,
    estNote: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'travailAFaire',
  });
  return travailAFaire;
};