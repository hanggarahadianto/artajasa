'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    static associate(models) {
      this.belongsTo(models.FormatMessage, { foreignKey: 'formatMessageId' });
      this.belongsTo(models.User, { foreignKey: 'userId' });
      this.belongsToMany(models.Admin, {
        through: 'AdminClient',
        foreignKey: 'clientId',
        otherKey: 'adminId',
      });
    }
  }
  Client.init(
    {
      userId: DataTypes.STRING,
      formatMessageId: DataTypes.INTEGER,
      institutionCode: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Client',
    },
  );
  return Client;
};
