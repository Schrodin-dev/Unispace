'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class devoir extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      devoir.belongsToMany(models.groupe, {
        foreignKey: {
          name: 'idDevoir'
        },
        through: 'aPourDevoir'
      });
      devoir.belongsToMany(models.user, {
        through: models.note
      });
      devoir.hasMany(models.note);
      devoir.belongsTo(models.ressource, {
          foreignKey: {
          name: 'idRessource',
          allowNull: false
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
    }
  }
  devoir.init({
    idDevoir: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    coeffDevoir: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min(value) {
          if (value <= 0) {
            throw new Error('le coefficient doit être supérieur à 0.');
          }
        },
        max: 100
      }
    },
    nomDevoir: {
      type: DataTypes.STRING,
      allowNull: false
    },
    noteMaxDevoir: {
      type: DataTypes.INTEGER,
      allowNull:false,
      defaultValue: 20
    }
  }, {
    sequelize,
    modelName: 'devoir',
    freezeTableName: true
  });
  return devoir;
};