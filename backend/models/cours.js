'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cours extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      cours.hasMany(models.contenuCours, {foreignKey: {
        name: 'nomCours',
        allowNull: false
      }});
      cours.hasMany(models.travailAFaire, {foreignKey: {
          name: 'nomCours',
          allowNull: false
        }});
    }
  }
  cours.init({
    nomCours: {
      type: DataTypes.STRING(100),
      primaryKey: true
    },
    couleurCours: {
      type:DataTypes.STRING(6),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'cours',
    freezeTableName: true
  });
  return cours;
};