var express = require('express');
const { loginUser, logout } = require('../app/controllers/authController');

const mid = require('../app/middlewares/restrict');
const { whoami } = require('../app/controllers/userController');

var router = express.Router();

router.post('/login', loginUser);
router.post('/logout', mid.auth, logout);
router.get('/whoami', mid.auth, whoami);

module.exports = router;
