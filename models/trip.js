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
    user: DataTypes.STRING,
    driver: DataTypes.STRING,
    vehicle: DataTypes.STRING,
    startLat: DataTypes.DECIMAL,
    startLng: DataTypes.DECIMAL,
    stopLat: DataTypes.DECIMAL,
    stopLng: DataTypes.DECIMAL,
    tripStatus: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Trip',
  });
  return Trip;
};