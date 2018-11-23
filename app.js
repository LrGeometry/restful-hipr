var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var options = require('./config/default.json');

// blockchain init [

var Blockchain = require('./blockchain/blockchain');

var blockchain = new Blockchain;

blockchain.init(options);

// blockchain init ]
// api init [

var api = require('./routes/api');

api.init(blockchain, options);

// api init ]

var app = express();

let
  cookieSession = require('cookie-session'),
  passport = require('passport'),
  auth = require('./auth');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

auth(passport);
app.use(passport.initialize());

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

var port = normalizePort(process.env.PORT || '8086');
app.set('port', port)

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieSession({
  name: 'session',
  keys: ['123']
}));

app.use(cookieParser());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); //My frontend APP domain
//  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:8080"); //My frontend APP domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/api/1.0', api.router);
// todo: api 2.0/3.0 [
//app.use('/api/2.0', api.router);
//app.use('/api/3.0', api.router);
// todo: api 2.0/3.0 ]

app.get('/auth/google', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/userinfo.profile']
}));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/'
    }),
    (req, res) => {
      req.session.token = req.user.token;
      res.redirect('/loggedin');
  }
);

app.get('/loggedin', (req, res) => {
  if (req.session.token) {
      res.cookie('token', req.session.token);
      res.json({
          status: 'session cookie set'
      });
  } else {
      res.cookie('token', '')
      res.json({
          status: 'session cookie not set'
      });
  }
});

app.get('/logout', (req, res) => {
  req.logout();
  req.session = null;
  res.redirect('/');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

app.listen(port, function () {
  console.log(`We are listening on port ${port}!`)
});



var WebSocketServer = require('./ws-server')

wsServer = new WebSocketServer(this)

var options = {
  rc_port: 25255,
  "remoteControl": {
    "jwt": {
        "secret": "secret",
        "timeout": 15
    }
  }
}

//wsServer.start(options);

module.exports = app;
