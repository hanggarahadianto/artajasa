'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // ...

    static findByUsername(username) {
      return this.findOne({
        where: {
          username,
        },
      });
    }

    static updateUser(username, newData) {
      return this.update(newData, {
        where: {
          username,
        },
      });
    }

    // ...
  }

  User.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING, 
      role: DataTypes.ENUM(['admin', 'client']),
      status: DataTypes.ENUM(['active', 'deactive']),
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};
