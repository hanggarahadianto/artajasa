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
const {
  addAdmin,
  deleteAdmin,
  getAllClientsByAdmin,
} = require('../app/controllers/adminController');
const { addClient } = require('../app/controllers/clientController');

//superAdmin
router.get('/', mid.auth, isSuperAdmin, getAllUsers);

router.get('/super-admin', mid.auth, isSuperAdmin, getAllSuperAdmin);
router.post('/super-admin', mid.auth, isSuperAdmin, addSuperAdmin);
router.put('/super-admin', mid.auth, isSuperAdmin, SelfModify);
router.delete('/super-admin/:id', mid.auth, isSuperAdmin, deleteSuperAdmin);

router.post('/admin', mid.auth, isSuperAdmin, addAdmin);
router.get('/admin', mid.auth, isSuperAdmin, getAllAdmin);
router.put('/admin', mid.auth, isAdmin, SelfModify);
router.delete('/admin/:id', mid.auth, isSuperAdmin, deleteAdmin);

router.get('/admin/clients', mid.auth, isAdmin, getAllClientsByAdmin);

router.get('/client', mid.auth, isSuperAdmin, getAllClient);
router.post('/client', mid.auth, isSuperAdmin, addClient);
router.put('/client', mid.auth, SelfModify);
router.post('/client/:id', mid.auth, isSuperAdmin, restoreUser);
// router.delete('/client/:id', mid.auth, isSuperAdmin, de)
router.put('/terminate/:id', mid.auth, isSuperAdmin, terUser);

module.exports = router;
