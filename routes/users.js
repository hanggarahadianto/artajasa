var express = require('express');
const {
  login,
  terUser,
  getAllUsers,
  searchUser,
  modifyUser,
  whoami,
  selfModify,
  getAllAdmin,
  getAllClientByAdmin,
  logout,
  addSuperAdmin,
  getAllSuperAdmin,
  deleteSuperAdmin,
} = require('../app/controllers/userController');
var router = express.Router();
const mid = require('../app/middlewares/restrict');
const { isAdmin, isSuperAdmin } = require('../app/middlewares/rbac');
const { addAdmin, deleteAdmin } = require('../app/controllers/adminController');

//superAdmin
router.get('/', mid.auth, isSuperAdmin, getAllUsers);
router.post('/super-admin', mid.auth, isSuperAdmin, addSuperAdmin);
router.get('/super-admin', mid.auth, isSuperAdmin, getAllSuperAdmin);
router.delete('/super-admin/:id', mid.auth, isSuperAdmin, deleteSuperAdmin);

//all user
router.get('/whoami', mid.auth, whoami);
// router.put('/self-modify', mid.auth, selfModify);
// router.post('/logout', mid.auth, logout);

//admin
router.post('/admin', mid.auth, isSuperAdmin, addAdmin);
router.delete('/admin/:id', mid.auth, isSuperAdmin, deleteAdmin);

//client
router.put('/:id', mid.auth, isAdmin, terUser);

router.get('/get-all-admin', mid.auth, isSuperAdmin, getAllAdmin);
router.get('/get-all-client-by-admin', mid.auth, isAdmin, getAllClientByAdmin);
// router.delete('/:id', mid.auth, isAdmin, deleteUser);
// router.get('/search', mid.auth, isAdmin, searchUser);
// router.put('/modify/:user_id', mid.auth, isAdmin, modifyUser);

module.exports = router;
