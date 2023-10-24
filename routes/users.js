var express = require('express');
const {
  addUser,
  login,
  terUser,
} = require('../app/controllers/userController');
var router = express.Router();
const mid = require('../app/middlewares/restrict');

/* GET users listing. */

router.post('/', mid.auth, addUser);
router.post('/login', login);
router.patch('/:id', terUser);

module.exports = router;
