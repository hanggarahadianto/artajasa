'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'userId' });
      this.belongsToMany(models.Client, {
        through: 'AdminClient',
        foreignKey: 'adminId',
        otherKey: 'clientId',
      });
    }
  }
  Admin.init(
    {
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Admin',
    },
  );
  return Admin;
};
