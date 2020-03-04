"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.env = exports.MIGRATION_API = exports.LOGGER_TAG = exports.NODE_ENV = exports.PORT = void 0;
var PORT = parseInt(process.env.PORT) || 3000;
exports.PORT = PORT;
var NODE_ENV = process.env.NODE_ENV || 'development';
exports.NODE_ENV = NODE_ENV;
var LOGGER_TAG = process.env.LOGGER_TAG || 'DEVELOP';
exports.LOGGER_TAG = LOGGER_TAG;
var MIGRATION_API = process.env.MIGRATION_API || '';
exports.MIGRATION_API = MIGRATION_API;
var env = {
  PORT: PORT,
  NODE_ENV: NODE_ENV,
  LOGGER_TAG: LOGGER_TAG,
  MIGRATION_API: MIGRATION_API
};
exports.env = env;