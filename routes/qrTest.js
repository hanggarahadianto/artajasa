var express = require('express');


var router = express.Router();

const mid = require('../app/middlewares/restrict');
const { isSuperAdmin, isAdmin } = require('../app/middlewares/rbac');
const { requestQR } = require('../app/controllers/qrTest');

router.post(
  '/qrtest',
  // mid.auth,
  requestQR,
);
// router.get('/inquiry/mpan-acquirer', mid.auth, getAllInquiryMpanQR);
// router.delete('/delete/:id', mid.auth, deleteQRInquiryMpanAcquirer);
// router.put('/update/:id', updateQR);

module.exports = router;
