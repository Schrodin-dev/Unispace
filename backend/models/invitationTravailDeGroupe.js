'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class invitationTravailDeGroupe extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.belongsTo(models.travailDeGroupe, {
				onDelete: 'cascade'
			})
			this.belongsTo(models.user, {
				onDelete: 'cascade'
			})
		}
	}
	invitationTravailDeGroupe.init({
		UUIDInvitation: {
			type: DataTypes.UUID,
			required:true
		}
	}, {
		sequelize,
		modelName: 'invitationTravailDeGroupe',
		freezeTableName: true
	});
	return invitationTravailDeGroupe;
};