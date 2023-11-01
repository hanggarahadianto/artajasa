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
  deleteUser,
  getAllAdmin,
} = require('../app/controllers/userController');
var router = express.Router();
const mid = require('../app/middlewares/restrict');
const { isAdmin, isSuperAdmin } = require('../app/middlewares/rbac');

//all user
router.get('/whoami', mid.auth, whoami);
// router.put('/self-modify', mid.auth, selfModify);

//admin only
router.post('/admin', mid.auth, isSuperAdmin, addUser);
// router.put('/:id', mid.auth, isAdmin, terUser);
router.get('/get-all-users', mid.auth, isSuperAdmin, getAllUsers);
router.get('/get-all-admin', mid.auth, isSuperAdmin, getAllAdmin);
// router.delete('/:id', mid.auth, isAdmin, deleteUser);
// router.get('/search', mid.auth, isAdmin, searchUser);
// router.put('/modify/:user_id', mid.auth, isAdmin, modifyUser);

module.exports = router;
