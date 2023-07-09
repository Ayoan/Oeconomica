'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Oeconomica extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Oeconomica.init({
    balance: DataTypes.STRING,
    date: DataTypes.DATEONLY,
    category: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    memo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Oeconomica',  
  });
  return Oeconomica;
};