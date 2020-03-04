"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _winston = _interopRequireWildcard(require("winston"));

var _moment = _interopRequireDefault(require("moment"));

var _env = require("./env");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var combine = _winston.format.combine,
    timestamp = _winston.format.timestamp,
    label = _winston.format.label,
    printf = _winston.format.printf,
    metadata = _winston.format.metadata;
var myFormat = printf(function (info) {
  var metas = [];
  Object.keys(info).forEach(function (e) {
    var value = '';

    if (e !== 'timestamp' && e !== 'label' && e !== 'level' && e !== 'message') {
      value = info[e];

      if (value !== '' && value !== undefined) {
        metas.push("".concat(e, ":").concat(value));
      }
    }
  });
  return "".concat(info.timestamp, " [").concat(info.label, "] ").concat(info.level.toUpperCase(), " ").concat(info.message, " | ").concat(metas.join(' | '));
});
var dateStr = (0, _moment["default"])().format('YYYY-MM-DD');
var logger = null;

if (_env.env.NODE_ENV === 'development') {
  logger = new _winston["default"].createLogger({
    transports: [new _winston["default"].transports.File({
      filename: "./logs/".concat(dateStr, ".log"),
      level: 'debug',
      format: combine(label({
        label: _env.env.LOGGER_TAG
      }), timestamp(), myFormat)
    }), new _winston["default"].transports.Console({
      level: 'debug',
      format: combine(label({
        label: _env.env.LOGGER_TAG
      }), timestamp(), myFormat)
    })]
  });
} else {
  logger = new _winston["default"].createLogger({
    transports: [new _winston["default"].transports.File({
      filename: "./logs/".concat(dateStr, ".log"),
      level: 'debug',
      format: combine(label({
        label: _env.env.LOGGER_TAG
      }), timestamp(), myFormat)
    })]
  });
}

var _default = logger;
exports["default"] = _default;