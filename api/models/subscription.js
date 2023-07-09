'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Subscription.init({
    day: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 31
      },
    },
    category: DataTypes.STRING,
    subscription: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    payday: DataTypes.DATEONLY,
  }, {
    sequelize,
    modelName: 'Subscription',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });
  return Subscription;
};