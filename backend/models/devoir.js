'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class devoir extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  devoir.init({
    idDevoir: DataTypes.INTEGER,
    coeffDevoir: DataTypes.FLOAT,
    nomDevoir: DataTypes.STRING,
    idRessource: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'devoir',
  });
  return devoir;
};