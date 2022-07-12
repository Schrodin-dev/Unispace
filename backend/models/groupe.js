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
      groupe.hasMany(models.user, {foreignKey: {
        name: 'nomGroupe',
        allowNull: false
      }});
      groupe.belongsTo(models.classe, {foreignKey: 'nomClasse'});
      groupe.belongsToMany(models.travailAFaire, {through: 'doitFaire'});
      groupe.belongsToMany(models.contenuCours, {through: 'aFait'});
    }
  }
  groupe.init({
    nomGroupe: {
      type: DataTypes.STRING(4),
      primaryKey: true
    },
    lienICalGroupe: {
      type: DataTypes.STRING(512),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'groupe',
    freezeTableName: true
  });
  return groupe;
};