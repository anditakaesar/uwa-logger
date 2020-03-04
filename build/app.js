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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.use((0, _helmet["default"])());
app.use((0, _compression["default"])());
app.use((0, _bodyParser.json)());
app.use((0, _bodyParser.urlencoded)({
  extended: true
})); // router

app.use('/user', require('./authrouter')["default"]);
app.use('/log', require('./logrouter')["default"]);
app.use('/migration', require('./migrationrouter')["default"]);
app.use(function (err, req, res, next) {
  if (err) {
    _logger["default"].error(err.message, {
      intmsg: err.intmsg
    });

    res.status(err.status).json({
      message: err.message
    });
  }
});
var _default = app;
exports["default"] = _default;