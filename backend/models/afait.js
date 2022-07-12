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
      aFait.belongsTo(models.groupe);
      aFait.belongsTo(models.contenuCours);
    }
  }
  aFait.init({
    nomGroupe: {
      type:DataTypes.STRING(4),
      primaryKey: true,

      references: {
        model : 'groupe',
        key: 'nomGroupe'
      }
    },
    idContenuCours: {
      type: DataTypes.INTEGER,
      primaryKey: true,

      references: {
        model: 'contenuCours',
        key: 'idContenuCours'
      }
    }
  }, {
    sequelize,
    modelName: 'aFait',
    freezeTableName: true
  });
  return aFait;
};