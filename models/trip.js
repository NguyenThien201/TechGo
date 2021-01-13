'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Trip.belongsTo(models.BookingOrder);
    }
  };
  Trip.init({
    customerId: DataTypes.INTEGER,
    driverId: DataTypes.INTEGER,
    vehicle: DataTypes.STRING,
    start: DataTypes.STRING,
    dest: DataTypes.STRING,
    cost: DataTypes.INTEGER,
    tripStatus: DataTypes.STRING,
    pickTime:DataTypes.DATE,
    dropTime:DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Trip',
  });
  return Trip;
};