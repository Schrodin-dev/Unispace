'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class docsTravailARendre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      docsTravailARendre.belongsTo(models.travailAFaire);
    }
  }
  docsTravailARendre.init({
    idDoc: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    lienDoc: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    idTravailAFaire: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references:{
        model: 'travailAFaire',
        key: 'idTravailAFaire'
      }
    }
  }, {
    sequelize,
    modelName: 'docsTravailARendre',
    freezeTableName: true
  });
  return docsTravailARendre;
};