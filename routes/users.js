var express = require('express');
const { addUser, login } = require('../app/controllers/userController');
var router = express.Router();

/* GET users listing. */

router.post('/', addUser);
router.post('/login', login);

module.exports = router;
