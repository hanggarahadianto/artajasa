var express = require('express');
const {
  terUser,
  getAllUsers,
  whoami,
  getAllAdmin,
  getAllClientByAdmin,
  addSuperAdmin,
  getAllSuperAdmin,
  deleteSuperAdmin,
  SelfModify,
  restoreUser,
  getAllClient,
  deleteUser,
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

//Super Admin
router.put('/super-admin', mid.auth, isSuperAdmin, SelfModify);
router.get('/whoami', mid.auth, whoami);
//router.delete('/client/:id', mid.auth, isSuperAdmin, deleteUser);
router.post('/client/:id', mid.auth, isSuperAdmin, restoreUser);
router.get('/client', mid.auth, isSuperAdmin, getAllClient);

//admin
router.post('/admin', mid.auth, isSuperAdmin, addAdmin);
router.delete('/admin/:id', mid.auth, isSuperAdmin, deleteAdmin);

//client
router.put('/:id', mid.auth, isAdmin, terUser);

//admin only
router.put('/admin', mid.auth, isAdmin, SelfModify);
router.put('/:id', mid.auth, isAdmin, terUser);
router.get('/get-all-users', mid.auth, isSuperAdmin, getAllUsers);
router.put('/terminate/:id', mid.auth, isSuperAdmin, terUser);
router.get('/admin', mid.auth, isSuperAdmin, getAllUsers);
router.get('/get-all-admin', mid.auth, isSuperAdmin, getAllAdmin);
router.get('/admin/clients', mid.auth, isAdmin, getAllClientByAdmin);

// router.get('/search', mid.auth, isAdmin, searchUser);
// router.put('/modify/:user_id', mid.auth, isAdmin, modifyUser);

//client only
router.put('/client', mid.auth, SelfModify);

module.exports = router;
