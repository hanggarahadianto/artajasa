var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var inquiryRouter = require("./routes/inquiry");
var paymentRouter = require("./routes/payment");

var app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin: "*" }));

app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/inquiry", inquiryRouter);
app.use("/api/paycredit", paymentRouter);

module.exports = app;
