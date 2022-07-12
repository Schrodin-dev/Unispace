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
      classe.hasMany(models.groupe);
      classe.belongsTo(models.anneeUniv);
    }
  }
  classe.init({
    nomClasse: {
      type: DataTypes.STRING(2),
      primaryKey: true
    },
    anneeUniv: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: 'anneeUniv',
        key: 'nomAnneeUniv'
      }
    }
  }, {
    sequelize,
    modelName: 'classe',
    freezeTableName: true
  });
  return classe;
};