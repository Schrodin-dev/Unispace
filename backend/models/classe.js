'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class classe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      classe.hasMany(models.groupe, {foreignKey: {
        name: 'nomClasse',
        allowNull: false
      }});
      classe.belongsTo(models.anneeUniv, {
        foreignKey: {
          name: 'nomAnneeUniv',
          allowNull: false
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
      classe.belongsTo(models.parcours, {foreignKey: {
        name: 'nomParcours',
        allowNull: false
      }});
    }
  }
  classe.init({
    nomClasse: {
      type: DataTypes.STRING(2),
      primaryKey: true
    }
  }, {
    sequelize,
    modelName: 'classe',
    freezeTableName: true
  });
  return classe;
};