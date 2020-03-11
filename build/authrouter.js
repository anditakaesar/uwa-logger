"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkSession = checkSession;
exports["default"] = void 0;

var _express = require("express");

var _index = require("../models/index");

var _sequelize = require("sequelize");

var _utils = require("./utils");

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var User = require('../models/user')(_index.sequelize, _sequelize.DataTypes);

var router = (0, _express.Router)();
var generalMsg = "Login failed, please check your username and password";
router.post('/authorize', function (req, res, next) {
  process.nextTick(function () {
    User.findOne({
      where: {
        username: req.body.username
      }
    }).then(function (user) {
      if (!user) {
        next((0, _utils.genError)(generalMsg, "user not found ".concat(req.body.username), 401));
      } else {
        _bcrypt["default"].compare(req.body.password, user.password, function (err, valid) {
          if (err) next((0, _utils.genError)(generalMsg, err.message, 401));

          if (!valid) {
            next((0, _utils.genError)(generalMsg, "wrong password attempt ".concat(req.body.username), 401));
          } else {
            res.status(200).json({
              message: "login success",
              user: {
                id: user.id,
                username: user.username,
                email: user.email,
                apikey: user.apikey
              }
            });
          }
        });
      }
    })["catch"](function (err) {
      return next((0, _utils.genError)(err.message, ""));
    });
  });
});
router.post('/login', function (req, res, next) {
  process.nextTick(function () {
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(function (user) {
      if (!user) {
        next((0, _utils.genError)(generalMsg, "user not found \"".concat(req.body.email, "\""), 401));
      } else {
        _bcrypt["default"].compare(req.body.password, user.password, function (err, valid) {
          if (err) next((0, _utils.genError)(generalMsg, err.message, 401));

          if (!valid) {
            next((0, _utils.genError)(generalMsg, "wrong password attempt ".concat(req.body.username), 401));
          } else {
            req.session.user = {
              id: user.id,
              username: user.username,
              email: user.email,
              apikey: user.apikey
            };
            res.redirect('/');
          }
        });
      }
    })["catch"](function (err) {
      return next((0, _utils.genError)(err.message, ""));
    });
  });
});

function checkSession(req, res, next) {
  if (req.session.user || req.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

var _default = router;
exports["default"] = _default;