var express = require('express');
const { loginUser } = require('../app/controllers/authController');
var router = express.Router();

router.post('/login', loginUser);

module.exports = router;
