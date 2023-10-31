const Joi = require('joi');
const catchAsync = require('../util/catchAsync');
const {
  User,
  UserRole,
  Role,
  FormatMessage,
  Client,
} = require('../../database/models');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
  GetAllFormatMessage: catchAsync(async (req, res) => {
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
  }),
  addClientUser: catchAsync(async (req, res) => {
    const { formatMessageId, adminId } = req.body;

    const client = await Client.create({
      formatMessageId,
    }).then((client) => {
      create.c;
    });
  }),
};
