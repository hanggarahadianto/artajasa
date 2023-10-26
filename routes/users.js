var express = require('express');
const {
  addUser,
  login,
  searchUser,
  modifyUser,
} = require('../app/controllers/userController');
var router = express.Router();

/* GET users listing. */

router.post('/', addUser);
router.post('/login', login);
router.get('/search', searchUser);
router.put('/:user_id', modifyUser); 

module.exports = router;
