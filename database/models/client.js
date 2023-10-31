'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.FormatMessage, { foreignKey: 'formatMessageId' });
      this.hasMany(models.ClientHasAdmin, { foreignKey: 'clientId' });
    }
  }
  Client.init(
    {
      userId: DataTypes.STRING,
      formatMessageId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Client',
    },
  );
  return Client;
};
