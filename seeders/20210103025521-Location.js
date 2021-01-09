'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert("Locations",[{
      latitude:10.76299,
      longitude:106.68252,
      address:"ĐH Khoa học tự nhiên, 227 Nguyễn Văn Cừ, phường 4, quận 5, TPHCM",
      AccountId:1
    },{
      
    }])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
