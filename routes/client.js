var express = require('express');
const {
  addClient,
  getAllClients,
} = require('../app/controllers/clientController');
var router = express.Router();

const { auth } = require('../app/middlewares/restrict');
const { isSuperAdmin } = require('../app/middlewares/rbac');

router.post('/', auth, isSuperAdmin, addClient);
router.get('/', auth, isSuperAdmin, getAllClients);

module.exports = router;
