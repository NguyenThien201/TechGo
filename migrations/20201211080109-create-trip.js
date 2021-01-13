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
      customerId: {
        type: Sequelize.INTEGER	
      },
      driverId: {
        type: Sequelize.INTEGER
      },
      vehicle: {
        type: Sequelize.STRING
      },
      start:{
        type: Sequelize.STRING
      },
      dest: {
        type: Sequelize.STRING
      },
      pickTime:{
        type:Sequelize.DATE
      },
      dropTime:{
        type:Sequelize.DATE
      },
      cost:{
        type:Sequelize.INTEGER
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