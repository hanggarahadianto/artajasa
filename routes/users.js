var express = require('express');
const {
  addUser,
  login,
  terUser,
  getAllUsers,
  searchUser,
  modifyUser,
  whoami,
  selfModify,
} = require('../app/controllers/userController');
var router = express.Router();
const mid = require('../app/middlewares/restrict');
const { isAdmin } = require('../app/middlewares/rbac');

//admin only
router.post('/', mid.auth, isAdmin, addUser);

//all user
router.post('/login', login);
router.put('/terminate', terUser);
router.get('/whoami', mid.auth, whoami);
router.get('/GetAllUser', getAllUsers);
router.get('/search', searchUser);
router.put('/', modifyUser);
router.put('/self_modify', mid.auth, selfModify);

module.exports = router;
