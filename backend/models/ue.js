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
      UE.hasMany(models.ressource);
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
    coeffUE: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min(value){
          if(value <= 0){
            throw new Error('le coefficient doit être supérieur à 0.');
          }
        },
        max: 100
      }
    }
  }, {
    sequelize,
    modelName: 'UE',
    freezeTableName: true
  });
  return UE;
};