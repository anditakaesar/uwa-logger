"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _helmet = _interopRequireDefault(require("helmet"));

var _compression = _interopRequireDefault(require("compression"));

var _bodyParser = require("body-parser");

var _logger = _interopRequireDefault(require("./logger"));

var _expressHandlebars = _interopRequireDefault(require("express-handlebars"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _path = _interopRequireDefault(require("path"));

var _http = require("http");

var _env = require("./env");

var _authrouter = require("./authrouter");

var _cors = _interopRequireDefault(require("cors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var http = (0, _http.Server)(app);

var io = require('socket.io')(http);

var hbs = _expressHandlebars["default"].create({
  extname: 'hbs',
  defaultLayout: 'default',
  layoutsDir: _path["default"].join(__dirname, '../views/layouts'),
  partialsDir: _path["default"].join(__dirname, '../views/partials')
}); // middlewares


app.use((0, _helmet["default"])());
app.use((0, _compression["default"])());
app.use((0, _bodyParser.json)());
app.use((0, _bodyParser.urlencoded)({
  extended: true
}));
app.use((0, _expressSession["default"])({
  name: _env.env.SESSION_NAME,
  secret: _env.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: _env.env.SESSION_COOKIE_AGE * 1000,
    secure: _env.env.SESSION_COOKIE_SECURE
  }
}));
app.use((0, _cors["default"])());
app.use(_express["default"]["static"](_path["default"].join(__dirname, '../static')));
app.set('views', _path["default"].join(__dirname, '../views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine); // common data: res.data

app.use(function (req, res, next) {
  if (req.session.user) {
    res.data = {};
    res.data.user = req.session.user;
  }

  req.io = io;
  next();
});
app.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Welcome',
    data: res.data
  });
});
app.get('/login', function (req, res, next) {
  if (req.user) {
    res.redirect('/');
  } else {
    res.render('login', {
      title: 'Please Login',
      data: res.data
    });
  }
});
app.get('/logout', function (req, res, next) {
  req.session.destroy();

  if (res.data && res.data.user) {
    res.data.user = null;
  }

  res.render('login', {
    title: 'Please Login',
    data: res.data
  });
}); // router

app.use('/user', require('./authrouter')["default"]); // to authenticate / login

app.use('/log', require('./logrouter')["default"]); // to post a log

app.use('/migration', require('./migrationrouter')["default"]); // to migrate

app.use('/admin', _authrouter.checkSession, require('./adminrouter')["default"]); // admin pages
// error handler

app.use(function (err, req, res, next) {
  if (err) {
    _logger["default"].error(err.message, {
      intmsg: err.intmsg
    });

    res.status(err.status).json({
      message: err.message
    });
  }
}); // not found handler

app.use(function (req, res, next) {
  res.status(404).json({
    message: "resource not found"
  });
});
var _default = http;
exports["default"] = _default;