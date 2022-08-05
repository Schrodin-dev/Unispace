'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class travailDeGroupe extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.belongsToMany(models.groupe, {
				through: 'concernerGroupe',
				onDelete: 'cascade',
				foreignKey: 'idTravailDeGroupe'
			});

			this.belongsToMany(models.user, {
				through: 'travailler',
				onDelete: 'cascade',
				foreignKey: 'idTravailDeGroupe'
			});

			this.belongsToMany(models.user, {
				through: models.invitationTravailDeGroupe,
				onDelete: 'cascade'
			});
			this.hasMany(models.invitationTravailDeGroupe, {
				onDelete: 'cascade'
			})
		}
	}
	travailDeGroupe.init({
		idTravailDeGroupe: {
			type: DataTypes.INTEGER(1),
			primaryKey: true,
			autoIncrement: true
		},
		nomTravailDeGroupe: {
			type: DataTypes.STRING(50),
			required: true
		},
		membresMin: {
			type: DataTypes.INTEGER(),
			required: true,
			validate: {
				min: 1
			}
		},
		membresMax: {
			type: DataTypes.INTEGER(),
			required: true,
			validate: {
				min: 2
			}
		},
	}, {
		sequelize,
		modelName: 'travailDeGroupe',
		freezeTableName: true
	});
	return travailDeGroupe;
};