'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('devoirs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idDevoir: {
        type: Sequelize.INTEGER
      },
      coeffDevoir: {
        type: Sequelize.FLOAT
      },
      nomDevoir: {
        type: Sequelize.STRING
      },
      idRessource: {
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
    await queryInterface.dropTable('devoirs');
  }
};