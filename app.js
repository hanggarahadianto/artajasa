var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var swaggerUi = require('swagger-ui-express');
var YAML = require('yamljs');

var swaggerDocument = require('./swagger-output.json'); // Ubah pemanggilan file

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var inquiryRouter = require('./routes/inquiry');
var paymentRouter = require('./routes/payment');
var messageRouter = require('./routes/message');
var clientRouter = require('./routes/client');

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: '*' }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/inquiry', inquiryRouter);
app.use('/api/paycredit', paymentRouter);
app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);
app.use('/api/client', clientRouter);

module.exports = app;
