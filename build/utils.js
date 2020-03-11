"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genError = void 0;

var genError = function genError(message, intmsg) {
  var status = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;
  var error = new Error(message);
  error.intmsg = intmsg;
  error.status = status;
  return error;
};

exports.genError = genError;