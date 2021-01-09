'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Trips', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user: {
        type: Sequelize.STRING	
      },
      driver: {
        type: Sequelize.STRING
      },
      vehicle: {
        type: Sequelize.STRING
      },
      startLat: {
        type: Sequelize.DECIMAL
      },
      startLong: {
        type: Sequelize.DECIMAL
      },
      stopLat: {
        type: Sequelize.DECIMAL
      },
      stopLng: {
        type: Sequelize.DECIMAL
      },
      tripStatus: {
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Trips');
  }
};