var express = require('express');


const mid = require('../app/middlewares/restrict');

const { getReportTransaction } = require('../app/controllers/reportTransaction');

var router = express.Router();


router.get('/getreporttransaction', getReportTransaction)

module.exports = router;
