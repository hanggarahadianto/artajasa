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
  getAllClientByAdmin,
  logout,
  SelfModify,
} = require('../app/controllers/userController');
var router = express.Router();
const mid = require('../app/middlewares/restrict');
const { isAdmin, isSuperAdmin } = require('../app/middlewares/rbac');

//Super Admin
router.put('/super-admin', mid.auth, isSuperAdmin, SelfModify);
router.get('/whoami', mid.auth, whoami);

//admin only
router.post('/admin', mid.auth, isSuperAdmin, addUser);
<<<<<<< HEAD
router.put('/admin', mid.auth, isAdmin, SelfModify);
router.put('/:id', mid.auth, isAdmin, terUser);
router.get('/get-all-users', mid.auth, isSuperAdmin, getAllUsers);
=======
router.put('/terminate/:id', mid.auth, isSuperAdmin, terUser);
router.get('/admin', mid.auth, isSuperAdmin, getAllUsers);
>>>>>>> 923f943c6879096305329d6dac9f1ecedc80583a
router.get('/get-all-admin', mid.auth, isSuperAdmin, getAllAdmin);
router.get('/get-all-client-by-admin', mid.auth, isAdmin, getAllClientByAdmin);

router.delete('/client/:id', mid.auth, isSuperAdmin, deleteUser);
// router.get('/search', mid.auth, isAdmin, searchUser);
// router.put('/modify/:user_id', mid.auth, isAdmin, modifyUser);

//client only
router.put('/client', mid.auth, SelfModify);

module.exports = router;
