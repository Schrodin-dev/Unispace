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
    idTravailAFaire: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    dateTravailAFaire: {
      type: DataTypes.DATE,
      allowNull: false
    },
    descTravailAFaire: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estNote: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'travailAFaire',
    freezeTableName: true
  });
  return travailAFaire;
};