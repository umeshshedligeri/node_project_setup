var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const passport = require("passport");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRoutes');

var app = express();

const mongoose = require('mongoose');
// const http = require('http');
const bodyparser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');

//DB Connection
mongoose.connect(db.database, { useNewUrlParser: true,useUnifiedTopology: true  })
  .then(() => console.log("Connected to Mongoose"))
  .catch(err => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



//Passport middleware
app.use(passport.initialize());

//Passport Config
require("./config/passport")(passport);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);

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
