'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdminClient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AdminClient.init({
    adminId: DataTypes.STRING,
    clientId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AdminClient',
  });
  return AdminClient;
};