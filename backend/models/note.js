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
      note.belongsTo(models.user);
      note.belongsTo(models.devoir);
    };
  }
  note.init({
    noteDevoir: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min:0
      }
    }
  }, {
    sequelize,
    modelName: 'note',
    freezeTableName: true
  });
  return note;
};