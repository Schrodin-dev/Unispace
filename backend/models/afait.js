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
    nomGroupe: {
      type:DataTypes.STRING(2),
      primaryKey: true,

      references: {
        model : require('./groupe'),
        key: 'nomGroupe'
      }
    },
    idContenuCours: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    sequelize,
    modelName: 'aFait',
    freezeTableName: true
  });
  return aFait;
};