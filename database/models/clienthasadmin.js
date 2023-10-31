'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClientHasAdmin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Client, { foreignKey: 'clientId' });
      this.belongsTo(models.Admin, { foreignKey: 'adminId' });
    }
  }
  ClientHasAdmin.init(
    {
      clientId: DataTypes.STRING,
      adminId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'ClientHasAdmin',
    },
  );
  return ClientHasAdmin;
};
