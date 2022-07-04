'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class theme extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  theme.init({
    idTheme: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    imageTheme: {
      type: DataTypes.BLOB,
      allowNull: false
    },
    couleurPrincipaleTheme: {
      type: DataTypes.STRING,
      allowNull: false
    },
    couleurFond: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'theme',
    freezeTableName: true
  });
  return theme;
};