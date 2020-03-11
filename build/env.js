"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.env = exports.SESSION_COOKIE_SECURE = exports.SESSION_COOKIE_AGE = exports.SESSION_SECRET = exports.SESSION_NAME = exports.MIGRATION_API = exports.LOGGER_TAG = exports.NODE_ENV = exports.PORT = void 0;
var PORT = parseInt(process.env.PORT) || 3000;
exports.PORT = PORT;
var NODE_ENV = process.env.NODE_ENV || 'development';
exports.NODE_ENV = NODE_ENV;
var LOGGER_TAG = process.env.LOGGER_TAG || 'DEVELOP';
exports.LOGGER_TAG = LOGGER_TAG;
var MIGRATION_API = process.env.MIGRATION_API || '';
exports.MIGRATION_API = MIGRATION_API;
var SESSION_NAME = process.env.SESSION_NAME || 'session';
exports.SESSION_NAME = SESSION_NAME;
var SESSION_SECRET = process.env.SESSION_SECRET || 'very-hard-secret';
exports.SESSION_SECRET = SESSION_SECRET;
var SESSION_COOKIE_AGE = parseInt(process.env.SESSION_COOKIE_AGE) || 86400;
exports.SESSION_COOKIE_AGE = SESSION_COOKIE_AGE;
var SESSION_COOKIE_SECURE = _equalString(process.env.SESSION_COOKIE_SECURE, 'true') ? true : false;
exports.SESSION_COOKIE_SECURE = SESSION_COOKIE_SECURE;
var env = {
  PORT: PORT,
  NODE_ENV: NODE_ENV,
  LOGGER_TAG: LOGGER_TAG,
  MIGRATION_API: MIGRATION_API,
  SESSION_NAME: SESSION_NAME,
  SESSION_SECRET: SESSION_SECRET,
  SESSION_COOKIE_AGE: SESSION_COOKIE_AGE,
  SESSION_COOKIE_SECURE: SESSION_COOKIE_SECURE
};
exports.env = env;

function _equalString(str, comparer) {
  if (str.toLowerCase() === comparer) {
    return true;
  } else {
    return false;
  }
}