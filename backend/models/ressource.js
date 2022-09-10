'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ressource extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ressource.hasMany(models.etreLieUE);
      ressource.belongsToMany(models.UE, {through: models.etreLieUE});
      ressource.hasMany(models.devoir, {foreignKey: {
        name: 'idRessource',
        allowNull: false
      }});
    }
  }
  ressource.init({
    idRessource: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nomRessource: {
      type: DataTypes.STRING(256),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ressource',
    freezeTableName: true
  });
  return ressource;
};