const Joi = require('joi');
const Sequelize = require('sequelize');
const catchAsync = require('../util/catchAsync');
const {
  User,
  UserRole,
  Role,
  FormatMessage,
  Admin,
  Client,
  AdminClient,
} = require('../../database/models');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createClient } = require('../services/clientService');

const checkUsernameExist = async (v) => {
  const data = await User.findOne({
    where: {
      username: v,
    },
  });

  if (data) {
    throw new Error('Username already exists');
  }
};

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

const addClientSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(255)
    .required()
    .external(checkUsernameExist),
  password: Joi.string().min(6).pattern(passwordPattern).required().messages({
    'string.pattern.base':
      'Password must be a combination of uppercase and lowercase letters, and numbers.',
  }),
  status: Joi.string().valid('active', 'deactive').default('active'),
  adminId: Joi.string().required(),
  formatMessageId: Joi.number(),
});

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
  const { username, password, adminIds, institutionCode, formatMessageId } =
    req.body;

  const result = await createClient({
    username,
    password,
    adminIds,
    institutionCode,
    formatMessageId,
  });

  if (result.success) {
    res.status(201).json({
      status: true,
      message: 'User client created',
      newClient: result.newClient,
      createdAdminClients: result.createdAdminClients,
    });
  } else {
    res.status(400).json({ status: false, error: result.error });
  }
});

exports.getAllClients = catchAsync(async (req, res) => {
  try {
    const clients = await Client.findAll({
      include: [
        { model: User },
        {
          model: Admin,
          attributes: ['name'],
          through: { attributes: [] },
        },
      ],
    });

    const data = clients.map((e) => {
      return {
        id: e.id,
        username: e.User.username,
        status: e.User.status,
        admin: e.Admins,
      };
    });

    res.status(200).json({
      message: 'Retrieved all clients',
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

exports.updateClient = catchAsync(async (req, res) => {
  const adminID = req.user.id;
  const { formatMessageId } = req.body;

  const data = await Client.findOne({
    where: {
      userId: req.params.id,
    },
  });

  if (data) {
    if (adminID != data.adminId) {
      res.status(403).json({
        status: false,
        message: 'Permission Denied!',
      });
    } else {
      await data.update(
        {
          formatMessageId,
        },
        {
          where: {
            userId: req.params.id,
          },
        },
      );

      const updatedClient = await Client.findOne({
        where: {
          userId: req.params.id,
        },
      });

      res.status(200).json({
        status: true,
        message: 'Success update client!',
        updatedClient,
      });
    }
  } else {
    res.status(404).json({
      status: false,
      message: 'Client not found!',
    });
  }
});
