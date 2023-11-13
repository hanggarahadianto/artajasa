var express = require("express");

const mid = require("../app/middlewares/restrict");

const {
  getReportTransaction,
  getReportDetail,
} = require("../app/controllers/reportTransaction");

var router = express.Router();

router.get("/getreporttransaction", getReportTransaction);
router.get("/getreportdetail", getReportDetail);

module.exports = router;
