'use strict';
var bcrypt=require("bcryptjs");

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
    return queryInterface.bulkInsert("Accounts",[{
      name:"Admin",
      dob:"1/1/2000",
      email:"admin@fithcmus.khtn.vn",
      phone:"0123456789",
      avatar:"",
      address:"18KTPM-UDPTW",
      type:"Admin",
      password: bcrypt.hashSync("admin",bcrypt.genSaltSync(10)),
      isAdmin:true,
      resetToken:null,
      expireToken:null,
      createdAt:Sequelize.literal("NOW()"),
      updatedAt:Sequelize.literal("NOW()")
    }],{})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Accounts",null,{});
  }
};
