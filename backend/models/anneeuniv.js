'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class anneeUniv extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      anneeUniv.hasMany(models.classe, {foreignKey: {
        name: 'nomAnneeUniv',
        allowNull: false
      }});
      anneeUniv.hasMany(models.semestre, {foreignKey: 'nomAnneeUniv'});
    }
  }
  anneeUniv.init({
    nomAnneeUniv: {
      type: DataTypes.INTEGER(1),
      primaryKey: true,
      validate: {
        min: 1,
        max: 3
      }
    }
  }, {
    sequelize,
    modelName: 'anneeUniv',
    freezeTableName: true
  });
  return anneeUniv;
};