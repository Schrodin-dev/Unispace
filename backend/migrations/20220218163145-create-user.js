'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      emailUser: {
        type: Sequelize.STRING
      },
      nomUser: {
        type: Sequelize.STRING
      },
      prenomUser: {
        type: Sequelize.STRING
      },
      droitsUser: {
        type: Sequelize.INTEGER
      },
      mdpUser: {
        type: Sequelize.STRING
      },
      accepteRecevoirAnnonces: {
        type: Sequelize.BOOLEAN
      },
      idTheme: {
        type: Sequelize.INTEGER
      },
      nomGroupe: {
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
    await queryInterface.dropTable('users');
  }
};