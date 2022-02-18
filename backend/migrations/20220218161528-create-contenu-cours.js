'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contenuCours', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idContenuCours: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      dateContenuCours: {
        allowNull: false,
        type: Sequelize.DATE
      },
      descContenuCours: {
        allowNull: false,
        type: Sequelize.STRING
      },
      nomCours: {
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
    await queryInterface.dropTable('contenuCours');
  }
};