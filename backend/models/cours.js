'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cours extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  cours.init({
    nomCours: DataTypes.STRING,
    couleurCours: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'cours',
  });
  return cours;
};