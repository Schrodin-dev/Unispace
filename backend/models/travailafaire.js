'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class travailAFaire extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      travailAFaire.belongsToMany(models.groupe, {
        through: 'doitFaire',
        foreignKey: 'idTravailAFaire',
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });

      travailAFaire.hasMany(models.docsTravailARendre, {foreignKey: {
        name: 'idTravailAFaire',
        allowNull: false
      }});

      travailAFaire.belongsTo(models.cours, {foreignKey: {
        name: 'nomCours',
          allowNull: false
        }});
    }
  }
  travailAFaire.init({
    idTravailAFaire: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    dateTravailAFaire: {
      type: DataTypes.DATE,
      allowNull: false
    },
    descTravailAFaire: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    estNote: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'travailAFaire',
    freezeTableName: true
  });
  return travailAFaire;
};