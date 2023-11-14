const { TrxLogs } = require("../../database/models");
const catchAsync = require("../util/catchAsync");

const path = require("path");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const pdf = require("html-pdf");

exports.getReportTransaction = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const TrxLogsData = await TrxLogs.findAll({
    attributes: [
      "transactionCode",
      "processCode",
      "acquirerId",
      "mpan",
      "issuerId",
      "cpan",
      "referenceNumber",
      "transactionAmount",
      "tipAmount",
      "responseCode",
      "responseMessage",
      "operationalId",
    ],
  });

  const dataReport = TrxLogsData.map((data) => ({
    transactionCode: data.transactionCode,
    processCode: data.processCode,
    acquirerId: data.acquirerId,
    mpan: data.mpan,
    issuerId: data.issuerId,
    cpan: data.cpan,
    referenceNumber: data.referenceNumber,
    transactionAmount: data.transactionAmount,
    tipAmount: data.tipAmount,
    responseCode: data.responseCode,
    responseMessage: data.responseMessage.replace(/[\[\]\\"]/g, ""),
    operationalId: data.operationalId,
  }));

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

exports.getReportDetail = catchAsync(async (req, res) => {
  const TrxDetails = await TrxLogs.findAll({
    attributes: [
      "issuerId",
      "cpan",
      "acquirerId",
      "mpan",
      "transactionCode",
      "processCode",
      "referenceNumber",
      "transactionAmount",
      "tipAmount",
      "referenceNumber",
      "invoiceNumber",
      "testCaseCode",
      "testToolType",
      "responseCode",
      "responseMessage",
      "messageType",
      "messageCode",
      "rawBody",
      "operationalId",
      "createdAt",
      "createdBy",
      "updatedAt",
    ],
  });

  const dataReport = TrxDetails.map((data) => ({
    issuerId: data.issuerId,
    cpan: data.cpan,
    acquirerId: data.acquirerId,
    mpan: data.mpan,
    transactionCode: data.transactionCode,
    processCode: data.processCode,
    referenceNumber: data.referenceNumber,
    invoiceNumber: data.invoiceNumber,
    transactionAmount: data.transactionAmount,
    tipAmount: data.tipAmount,
    testCaseCode: data.testCaseCode,
    testToolType: data.testToolType,
    responseCode: data.responseCode,
    responseMessage: data.responseMessage.replace(/[\[\]\\"]/g, ""),
    messageType: data.messageType,
    messageCode: data.messageCode,
    rawBody: data.rawBody,
    operationalId: data.operationalId,
    createdAt: data.createdAt,
    createdBy: data.createdBy,
    updatedAt: data.updatedAt,
  }));

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

// exports.downloadReport = catchAsync(async (req, res) => {
//   try {
//     const dataReport = await TrxLogs.findAll({
//       attributes: ["cpan", "mpan"],
//     });
//     const templatePath = path.join(__dirname, "view", "report.html");
//     const htmlTemplate = await fs.readFile(templatePath, "utf-8");

//     const renderedHtml = renderHtml(htmlTemplate, { dataReport });

//     const pdfOptions = { format: "Letter" };

//     pdf.create(renderedHtml, pdfOptions).toBuffer((err, buffer) => {
//       if (err) {
//         console.error("Error generating PDF:", err.message);
//         res.status(500).json({ error: "Internal Server Error" });
//       } else {
//         res.setHeader("Content-Type", "application/pdf");
//         res.setHeader(
//           "Content-Disposition",
//           'attachment; filename="report-transaction.pdf"'
//         );
//         res.end(buffer);
//       }
//     });
//   } catch (error) {
//     console.error("Error generating PDF:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

exports.downloadReport = catchAsync(async (req, res) => {
  try {
    const dataReport = await TrxLogs.findAll({
      attributes: ["issuerId", "cpan", "mpan"],
    });

    const pdfOptions = { format: "Letter" };

    const htmlContent = `
      <html>
        <head>
          <style>
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
          </style>
        </head>
        <body>
          <h2>Report Transaction</h2>
          <table>
            <tr>
            <th>issuerId</th>
              <th>CPAN</th>
              <th>MPAN</th>
              <th>Price</th>
            </tr>
            ${dataReport
              .map(
                (data) => `
            <tr>
              <td>${data.issuerId}</td>
              <td>${data.cpan}</td>
              <td>${data.mpan}</td>

            </tr>
          `
              )
              .join("")}
        </table>
      </body>
    </html>
  `;

    pdf.create(htmlContent, pdfOptions).toBuffer((err, buffer) => {
      if (err) {
        console.error("Error generating PDF:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="report-payment.pdf"'
        );
        res.end(buffer);
      }
    });
  } catch (error) {
    console.error("Error generating PDF:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});