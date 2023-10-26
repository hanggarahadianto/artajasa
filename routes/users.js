var express = require('express');
const {
  addUser,
  login,
  terUser,
  getAllUsers,
  searchUser,
  modifyUser,
  whoami,
  cek,
} = require('../app/controllers/userController');
var router = express.Router();
const mid = require('../app/middlewares/restrict');
const { isAdmin } = require('../app/middlewares/rbac');

//admin only
router.post('/', mid.auth, isAdmin, addUser);

//all user
router.post('/login', login);
router.put('/:id', terUser);
router.get('/whoami', mid.auth, whoami);
router.get('/GetAllUser', getAllUsers);
router.get('/search', searchUser);
router.put('/:user_id', modifyUser);

module.exports = router;
