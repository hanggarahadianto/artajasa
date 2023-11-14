var express = require("express");

const mid = require("../app/middlewares/restrict");

const {
  getReportTransaction,
  getReportDetail,
  downloadReport,
} = require("../app/controllers/reportTransaction");

var router = express.Router();

router.get("/getreporttransaction", getReportTransaction);
router.get("/getreportdetail", getReportDetail);
router.get("/downloadreport", downloadReport);

module.exports = router;
