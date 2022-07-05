'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  note.init({
    emailUser: {
      type: DataTypes.STRING(128),
      primaryKey: true,

      references: {
        model: 'user',
        key: 'emailUser'
      }
    },
    idDevoir: {
      type: DataTypes.INTEGER,
      primaryKey: true,

      references: {
        model: 'devoir',
        key: 'idDevoir'
      }
    },
    noteDevoir: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'note',
    freezeTableName: true
  });
  return note;
};