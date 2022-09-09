'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class parcours extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			parcours.hasMany(models.UE, {foreignKey: {
					name: 'nomParcours',
					allowNull: false
				}});
			parcours.hasMany(models.classe, {foreignKey: {
				name: 'nomParcours',
				allowNull: false
			}});
		}
	}
	parcours.init({
		nomParcours: {
			type: DataTypes.STRING(10),
			primaryKey: true
		}
	}, {
		sequelize,
		modelName: 'parcours',
		freezeTableName: true
	});
	return parcours;
};