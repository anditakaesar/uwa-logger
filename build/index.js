"use strict";

require("dotenv/config");

var _env = require("./env");

var _logger = _interopRequireDefault(require("./logger"));

var _app = _interopRequireDefault(require("./app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import app from './app';
_app["default"].listen(_env.env.PORT, function () {
  if (_env.env.NODE_ENV === 'development') {
    _logger["default"].info("app listen at port ".concat(_env.env.PORT));
  }
});