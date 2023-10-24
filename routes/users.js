var express = require('express');
const { addUser, login, terUser } = require('../app/controllers/userController');
var router = express.Router();

/* GET users listing. */

router.post('/', addUser);
router.post('/login', login);


router.patch('/:id', terUser);

module.exports = router;