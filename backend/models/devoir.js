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
    idDevoir: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    coeffDevoir: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min(value) {
          if (value <= 0) {
            throw new Error('le coefficient doit être supérieur à 0.');
          }
        },
        max: 100
      }
    },
    nomDevoir: {
      type: DataTypes.STRING,
      allowNull: false
    },
    noteMaxDevoir: {
      type: DataTypes.INTEGER,
      allowNull:false,
      defaultValue: 20
    },
    idRessource: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: 'ressource',
        key: 'idRessource'
      }
    }
  }, {
    sequelize,
    modelName: 'devoir',
    freezeTableName: true
  });
  return devoir;
};