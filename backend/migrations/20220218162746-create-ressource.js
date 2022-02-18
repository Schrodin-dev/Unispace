'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ressources', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idRessource: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      nomRessource: {
        allowNull: false,
        type: Sequelize.STRING
      },
      coeffRessource: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      idUE: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      nomAnneeUniv: {
        allowNull: false,
        type: Sequelize.STRING
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
    await queryInterface.dropTable('ressources');
  }
};