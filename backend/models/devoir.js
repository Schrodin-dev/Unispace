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
      primaryKey: true
    },
    coeffDevoir: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    nomDevoir: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idRessource: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'devoir',
  });
  return devoir;
};