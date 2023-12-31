'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.UserRole, { foreignKey: 'userId' });
      this.hasOne(models.Admin, { foreignKey: 'userId' });
      this.hasMany(models.Client, { foreignKey: 'userId', as: 'client' });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM(['active', 'deactive']),
        defaultValue: 'active',
      },
      token: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};
