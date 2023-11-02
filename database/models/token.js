'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Token.init(
    {
      user_id: DataTypes.STRING,
      token: DataTypes.STRING(500),
      expires_at: DataTypes.DATE,
      revoked: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Token',
    },
  );
  return Token;
};
