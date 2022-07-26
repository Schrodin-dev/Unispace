'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UE extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UE.belongsToMany(models.ressource, {through: models.etreLieUE});
      UE.hasMany(models.etreLieUE);
      UE.belongsTo(models.semestre, {foreignKey: {
        name: 'nomSemestre',
        allowNull: false
      }});
    }
  }
  UE.init({
    idUE: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nomUE: {
      type: DataTypes.STRING,
      allowNull: false
    },
    numeroUE: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      validate: {
        min: 0,
        max: 6
      }
    }
  }, {
    sequelize,
    modelName: 'UE',
    freezeTableName: true
  });
  return UE;
};