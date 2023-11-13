'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class qrTest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  qrTest.init({
    qrString: DataTypes.STRING,
    amount: DataTypes.STRING,
    tipAmount: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'qrTest',
  });
  return qrTest;
};