var express = require('express');
const {
  addClient,
  getAllClients,
  updateClient,
} = require('../app/controllers/clientController');
var router = express.Router();

const mid = require('../app/middlewares/restrict');
const { isSuperAdmin, isAdmin } = require('../app/middlewares/rbac');
const {
  generateQRInquiryMpanAcquirer,
  getAllInquiryMpanQR,
  deleteQRInquiryMpanAcquirer,
} = require('../app/controllers/qrController');

router.post(
  '/inquiry/mpan-acquirer/:id',
  mid.auth,
  generateQRInquiryMpanAcquirer,
);
router.get('/inquiry/mpan-acquirer', mid.auth, getAllInquiryMpanQR);
router.delete('/delete/:id', mid.auth, deleteQRInquiryMpanAcquirer);

module.exports = router;
