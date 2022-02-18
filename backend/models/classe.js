'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class classe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  classe.init({
    nomClasse: DataTypes.STRING,
    anneeUniv: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'classe',
  });
  return classe;
};