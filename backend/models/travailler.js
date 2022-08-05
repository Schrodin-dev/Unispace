'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class travailler extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.belongsTo(models.groupeDeTravail, {
				onDelete: 'cascade'
			})
			this.belongsTo(models.user, {
				onDelete: 'cascade'
			})
		}
	}
	travailler.init({
		UUIDInvitation: {
			type: DataTypes.UUID
		}
	}, {
		sequelize,
		modelName: 'travailler',
		freezeTableName: true
	});
	return travailler;
};