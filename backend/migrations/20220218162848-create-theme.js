'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('themes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idTheme: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      imageTheme: {
        allowNull: false,
        type: Sequelize.BLOB
      },
      couleurPrincipaleTheme: {
        allowNull: false,
        type: Sequelize.STRING
      },
      couleurFond: {
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
    await queryInterface.dropTable('themes');
  }
};