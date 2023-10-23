var express = require('express');
const { addUser } = require('../app/controllers/userController');
var router = express.Router();

/* GET users listing. */

router.post('/', addUser);

module.exports = router;
