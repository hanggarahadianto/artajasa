var express = require('express');
const { loginUser, logout } = require('../app/controllers/authController');

const mid = require('../app/middlewares/restrict');

var router = express.Router();

router.post('/login', loginUser);
router.post('/logout', mid.auth, logout);

module.exports = router;
