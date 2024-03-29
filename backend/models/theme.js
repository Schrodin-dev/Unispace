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
      theme.hasMany(models.user, {foreignKey: {
        name: 'idTheme',
        allowNull: false,
        defaultValue: 1
      }});
    }
  }
  theme.init({
    idTheme: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sourceTheme: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    couleurPrincipaleTheme: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    couleurFond: {
      type: DataTypes.STRING(6),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'theme',
    freezeTableName: true
  });
  return theme;
};