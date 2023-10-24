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

/* GET users listing. */
router.get('/whoami', mid.auth, whoami);
router.post('/', mid.auth, isAdmin, addUser);
router.post('/login', login);
router.patch('/:id', terUser);
router.get('/:username', searchUser);
router.put('/:username', mid.auth, modifyUser);

module.exports = router;
