'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FormatMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Client, { foreignKey: 'formatMessageId' });
    }
  }
  FormatMessage.init(
    {
      messageType: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'FormatMessage',
    },
  );
  return FormatMessage;
};
