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
    }
  }
  doitFaire.init({
    nomGroupe: {
      type: DataTypes.STRING(2),
      primaryKey: true,

      references: {
        model: require('./groupe'),
        key: 'nomGroupe'
      }
    },
    idTravailAFaire: {
      type: DataTypes.INTEGER,
      primaryKey: true,

      references: {
        model: require('./travailafaire'),
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