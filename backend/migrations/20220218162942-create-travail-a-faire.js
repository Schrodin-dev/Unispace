'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('travailAFaires', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idTravailAFaire: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      dateTravailAFaire: {
        allowNull: false,
        type: Sequelize.DATE
      },
      descTravailAFaire: {
        allowNull: false,
        type: Sequelize.STRING
      },
      estNote: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('travailAFaires');
  }
};