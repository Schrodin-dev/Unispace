'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class groupe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  groupe.init({
    nomGroupe: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    lienICalGroupe: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nomClasse: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'groupe',
  });
  return groupe;
};