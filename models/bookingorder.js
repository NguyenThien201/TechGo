'use strict';
const {
  Model, DECIMAL
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookingOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BookingOrder.belongsTo(models.Account);
      BookingOrder.hasOne(models.Payment);
      BookingOrder.hasOne(models.Trip);
    }
  };
  BookingOrder.init({
    vehicle: DataTypes.STRING,
    start:DataTypes.STRING,
    end:DataTypes.STRING,
    bookingTime: DataTypes.DATE,
    orderStatus:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'BookingOrder',
  });
  return BookingOrder;
};