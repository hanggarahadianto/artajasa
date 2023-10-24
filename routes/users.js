var express = require('express');
const { addUser, login } = require('../app/controllers/userController');
const mid = require('../app/middlewares/restrict');
var router = express.Router();

/* GET users listing. */

router.post('/', mid.auth, addUser);
router.post('/login', login);

module.exports = router;
