var express = require('express');
const {
  addClient,
  getAllClients,
  updateClient,
  getAllQR,
  deleteQR,
} = require('../app/controllers/clientController');
var router = express.Router();

const mid = require('../app/middlewares/restrict');
const { isSuperAdmin, isAdmin } = require('../app/middlewares/rbac');

router.post('/', mid.auth, isSuperAdmin, addClient);
router.get('/', mid.auth, isSuperAdmin, getAllClients);
router.put('/:id', mid.auth, isAdmin, updateClient);
router.get('/qr', getAllQR);
router.delete('/qr/:id', deleteQR);

module.exports = router;
