const Joi = require('joi');
const catchAsync = require('../util/catchAsync');
const {
  User,
  UserRole,
  Role,
  FormatMessage,
  Admin,
  Client,
} = require('../../database/models');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
  await addClientSchema.validateAsync(req.body, { abortEarly: false });

  const { username, password, adminId } = req.body;

  const adminExist = await Admin.findOne({
    where: {
      userId: adminId,
    },
  });

  // const fmExist = await FormatMessage.findOne({
  //   where: {
  //     id: formatMessageId,
  //   },
  // });

  if (!adminExist) {
    res.status(404).json({
      status: false,
      message: "Admin with the adminId isn't found",
    });
  } else {
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      id: userId,
      username,
      password: hashedPassword,
    });
    const userRole = await UserRole.create({
      userId: user.id,
      roleId: 3,
    });
    const client = await Client.create({
      id: uuidv4(),
      adminId: adminExist.userId,
      userId: user.id,
    });

    res.status(200).json({
      status: true,
      data: user,
      userRole,
      client,
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
              {
                model: FormatMessage,
                attributes: {
                  exclude: ['id', 'createdAt', 'updatedAt'],
                },
              },
              { model: Admin },
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
        formatMessage: user.User.client[0].FormatMessage,
        adminId: user.User.client[0].adminId,
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
