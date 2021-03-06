var createError = require('http-errors');
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var localStrategy = require('passport-local');
var crypto = require('crypto');

var indexRouter = require('./routes/index');
var homeRouter = require('./routes/home');
var usersRouter = require('./routes/users');
var regRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var testRouter = require('./routes/test');

const connection = mysql.createConnection({
  host : 'localhost',
  user : 'Dave',
  password : '1996',
  database : 'msg_board_express'
});

connection.connect(function (err) {
  if( err ) {
    console.log('error connecting' + err.stack);
    return ;
  }
  console.log('connected as id' + connection.threadId);
})

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({
  secret : 'secret',
  resave : false,
  saveUninitializaed : false
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.authenticate('session'));
// app.use(passport());

app.use('/', indexRouter);
app.use('/home', homeRouter);
app.use('/users', usersRouter);
app.use('/register', regRouter);
app.use('/login', loginRouter);
app.use('/test', testRouter);

// app.get('/', (req, res) => {
//   res.send('Hello World');
// })

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
