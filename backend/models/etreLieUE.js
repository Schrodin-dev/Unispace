'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class etreLieUE extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			//etreLieUE.belongsTo(models.ressource);
			//etreLieUE.belongsTo(models.UE);
		}
	}
	etreLieUE.init({
		coeffRessource: {
			type: DataTypes.FLOAT,
			allowNull: false,
			validate: {
				min(value){
					if(value <= 0){
						throw new Error('le coefficient doit être supérieur à 0.');
					}
				},
				max: 100
			}
		}
	}, {
		sequelize,
		modelName: 'etreLieUE',
		freezeTableName: true
	});
	return etreLieUE;
};