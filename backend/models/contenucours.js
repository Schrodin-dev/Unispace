'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class contenuCours extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  contenuCours.init({
    idContenuCours: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    dateContenuCours: {
      type: DataTypes.DATE,
      allowNull: false
    },
    descContenuCours: {
      type:DataTypes.TEXT,
      allowNull: false
    },
    nomCours: {
      type:DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'contenuCours',
    freezeTableName: true
  });
  return contenuCours;
};