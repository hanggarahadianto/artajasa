'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.models.belongsTo(models.User, { foreignKey: 'userId' });
      this.models.belongsTo(models.Role, { foreignKey: 'roleId' });
    }
  }
  UserRole.init(
    {
      userId: DataTypes.STRING,
      roleId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'UserRole',
    },
  );
  return UserRole;
};
