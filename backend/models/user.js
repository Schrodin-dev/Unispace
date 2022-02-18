'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.);
    }
  }
  user.init({
    emailUser: DataTypes.STRING,
    nomUser: DataTypes.STRING,
    prenomUser: DataTypes.STRING,
    droitsUser: DataTypes.INTEGER,
    mdpUser: DataTypes.STRING,
    accepteRecevoirAnnonces: DataTypes.BOOLEAN,
    idTheme: DataTypes.INTEGER,
    nomGroupe: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};