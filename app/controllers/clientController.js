const Joi = require('joi');
const catchAsync = require('../util/catchAsync');
const {
  User,
  UserRole,
  Role,
  FormatMessage,
  Admin,
  Client,
  ClientHasAdmin,
} = require('../../database/models');
const { v4: uuidv4 } = require('uuid');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.GetAllFormatMessage = catchAsync(async (req, res) => {
  const format = await FormatMessage.findAll();

  if (format.length <= 0) {
    res.status(404).json({
      status: false,
      message: 'Data not found!',
    });
  } else {
    res.status(200).json({
      status: true,
      message: 'Get Data Success',
      data: format,
    });
  }
});

exports.addClient = catchAsync(async (req, res) => {
  const { username, password, adminId, formatMessageId } = req.body;

  const adminExist = await Admin.findOne({
    where: {
      id: adminId,
    },
  });

  const fmExist = await FormatMessage.findOne({
    where: {
      id: formatMessageId,
    },
  });

  if (!adminExist) {
    res.status(404).json({
      status: false,
      message: "Admin with the adminId isn't found",
    });
  } else if (!fmExist) {
    res.status(404).json({
      status: false,
      message: "Format Message with the formatMessageId isn't found",
    });
  } else {
    const userId = uuidv4();
    const user = await User.create({
      id: userId,
      username,
      password,
    });
    const userRole = await UserRole.create({
      userId: user.id,
      roleId: 3,
    });
    const client = await Client.create({
      id: uuidv4(),
      formatMessageId,
      adminId,
      userId: user.id,
    });
    const clientHasAdmin = await ClientHasAdmin.create({
      clientId: client.id,
      adminId,
    });

    res.status(200).json({
      status: true,
      data: user,
      userRole,
      client,
      clientHasAdmin,
    });
  }
});

exports.getAllClients = catchAsync(async (req, res) => {
  const users = await UserRole.findAll({
    where: {
      roleId: 3,
    },
    include: [
      {
        model: User,
        include: [
          {
            model: Client,
            as: 'client',
            include: [
              { model: FormatMessage },
              { model: ClientHasAdmin, include: Admin },
            ],
          },
        ],
      },
      {
        model: Role,
      },
    ],
  });

  if (users.length <= 0) {
    res.status(404).json({
      status: false,
      message: 'Users not found!',
    });
  } else {
    const data = users.map((user) => {
      return {
        id: user.User.id,
        username: user.User.username,
        role: user.Role.roleName,
        formatMessage: user.User.client[0].FormatMessage.messageType,
        admin: user.User.client[0].ClientHasAdmins[0].Admin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });

    res.status(200).json({
      status: true,
      message: 'All client users',
      data,
    });
  }
});
