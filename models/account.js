'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Account.hasMany(models.BookingOrder);
      Account.hasMany(models.Trip);
    }
  };
  Account.init({
    name: DataTypes.STRING,
    dob:DataTypes.DATEONLY,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    avatar:DataTypes.TEXT,
    type: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    resetToken:DataTypes.STRING,
    expireToken:DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Account',
  });
  return Account;
};