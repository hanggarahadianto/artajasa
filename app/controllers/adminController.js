const Joi = require('joi');
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
const { createAdmin } = require('../services/adminService');

exports.addAdmin = catchAsync(async (req, res) => {
  const { username, password, name } = req.body;

  const result = await createAdmin({
    username,
    password,
    name,
  });

  if (result.success) {
    res.status(201).json({
      status: true,
      message: 'User client created',
      newAdmin: result.newAdmin,
    });
  } else {
    res.status(400).json({ status: false, error: result.error });
  }
});

exports.deleteAdmin = catchAsync(async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!user) {
    res.status(400).json({
      status: false,
      message: 'User not found!',
    });
  } else {
    const data = await User.destroy({
      where: {
        id: req.params.id,
      },
    });

    await UserRole.destroy({
      where: {
        userId: req.params.id,
      },
    });

    await Admin.destroy({
      where: {
        userId: req.params.id,
      },
    });

    res.status(200).json({
      status: true,
      message: 'User berhasil dihapus',
      data: data,
    });
  }
});

exports.getAllClientsByAdmin = catchAsync(async (req, res) => {
  try {
    const adminId = req.user.id;

    const clients = await Client.findAll({
      include: [
        {
          model: User,
        },
        {
          model: Admin,
          attributes: ['name'],
          through: {
            model: AdminClient,
            attributes: [],
          },
          where: { id: adminId },
        },
      ],
    });

    const data = clients.map((e) => {
      return {
        id: e.id,
        username: e.User.username,
        status: e.User.status,
      };
    });

    res.status(200).json({
      message: `Get All Clients`,
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
