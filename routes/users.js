var express = require('express');
const {
  addUser,
  login,
  getAllUsers,
  searchUser,
  modifyUser,
  selfModify,
} = require('../app/controllers/userController');
var router = express.Router();

/* GET users listing. */

router.post('/', addUser);
router.post('/login', login);
router.get('/GetAllUser', getAllUsers);
router.get('/search', searchUser);
router.put('/:user_id', modifyUser); 
router.put('/self_modify', mid.auth, selfModify);

module.exports = router;
