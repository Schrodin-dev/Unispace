'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('docsContenuCours', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idDoc: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      doc: {
        allowNull: false,
        type: Sequelize.BLOB
      },
      idContenuCours: {
        allowNull: false,
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('docsContenuCours');
  }
};