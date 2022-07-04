'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class docsContenuCours extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  docsContenuCours.init({
    idDoc: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    doc: {
      type:DataTypes.BLOB,
      allowNull: false
    },
    idContenuCours: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'docsContenuCours',
    freezeTableName: true
  });
  return docsContenuCours;
};