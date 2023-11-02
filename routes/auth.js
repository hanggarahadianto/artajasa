var express = require('express');
const { loginUser } = require('../app/controllers/authController');
const { getAllQR } = require('../app/controllers/clientController');
var router = express.Router();

router.post('/login', loginUser);
router.get('/qr', getAllQR);

module.exports = router;
