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
router.put('/terminate/:id', mid.auth, isAdmin, terUser);
router.get('/GetAllUser', mid.auth, isAdmin, getAllUsers);
router.get('/search', mid.auth, isAdmin, searchUser);
router.put('/:user_id', mid.auth, isAdmin, modifyUser);

//all user
router.post('/login', login);
router.get('/whoami', mid.auth, whoami);
router.put('/self_modify', mid.auth, selfModify);

module.exports = router;
