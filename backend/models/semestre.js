'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class semestre extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			semestre.belongsTo(models.anneeUniv, {foreignKey: 'nomAnneeUniv'});
			semestre.hasMany(models.UE, {foreignKey: {
				name: 'nomSemestre',
				allowNull: false
			}});
		}
	}
	semestre.init({
		nomSemestre: {
			type: DataTypes.INTEGER(1),
			primaryKey: true
		}
	}, {
		sequelize,
		modelName: 'semestre',
		freezeTableName: true
	});
	return semestre;
};