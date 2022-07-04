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
    }
  }
  docsTravailARendre.init({
    idDoc: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    doc: {
      type: DataTypes.BLOB,
      allowNull: false
    },
    idTravailAFaire: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references:{
        model: require('travailafaire'),
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