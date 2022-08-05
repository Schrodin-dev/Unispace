'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class groupeDeTravail extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.belongsTo(models.travailDeGroupe, {
				foreignKey: 'idTravailDeGroupe',
				onDelete: 'cascade'
			});

			this.belongsToMany(models.user, {
				through: models.travailler
			});
			this.hasMany(models.travailler);
		}
	}
	groupeDeTravail.init({
		idGroupeDeTravail: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		}
	}, {
		sequelize,
		modelName: 'groupeDeTravail',
		freezeTableName: true
	});
	return groupeDeTravail;
};