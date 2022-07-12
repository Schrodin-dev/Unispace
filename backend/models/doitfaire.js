'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class doitFaire extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      doitFaire.belongsTo(models.groupe);
      doitFaire.belongsTo(models.travailAFaire);
    }
  }
  doitFaire.init({
    nomGroupe: {
      type: DataTypes.STRING(4),
      primaryKey: true,

      references: {
        model: 'groupe',
        key: 'nomGroupe'
      }
    },
    idTravailAFaire: {
      type: DataTypes.INTEGER,
      primaryKey: true,

      references: {
        model: 'travailAFaire',
        key: 'idTravailAFaire'
      }
    }
  }, {
    sequelize,
    modelName: 'doitFaire',
    freezeTableName: true
  });
  return doitFaire;
};