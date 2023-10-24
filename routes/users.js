var express = require('express');
const {
  addUser,
  login,
  terUser,
  modifyUser,
  searchUser,
  whoami,
} = require('../app/controllers/userController');
var router = express.Router();
const mid = require('../app/middlewares/restrict');
const { isAdmin } = require('../app/middlewares/rbac');

//admin only
router.post('/', mid.auth, isAdmin, addUser);

//all user
router.post('/login', login);
router.get('/whoami', mid.auth, whoami);
router.patch('/:id', terUser);
router.get('/:username', searchUser);
router.put('/:username', mid.auth, modifyUser);

module.exports = router;
