const {
  User,
  UserRole,
  Role,
  FormatMessage,
  Admin,
  Client,
  AdminClient,
  qrTest,
  TrxLogs,
} = require("../../database/models");
const catchAsync = require("../util/catchAsync");

exports.getReportTransaction = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const dataReport = await TrxLogs.findAll({
    attributes: ["mpan", "cpan"],
    limit: parseInt(limit),
    offset: offset,
  });

  if (dataReport.length <= 0) {
    res.status(404).json({
      status: false,
      message: "Data not found!",
    });
  } else {
    res.status(200).json({
      status: true,
      message: "Get Report Transaction Data Success",
      data: dataReport,
    });
  }
});
