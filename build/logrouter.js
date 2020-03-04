"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _index = require("../models/index");

var _sequelize = require("sequelize");

var _utils = require("./utils");

var _logger = _interopRequireDefault(require("./logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var User = require('../models/user')(_index.sequelize, _sequelize.DataTypes);

var Userlog = require('../models/userlog')(_index.sequelize, _sequelize.DataTypes);

var router = (0, _express.Router)();
router.post('/', getUserByApi, function (req, res, next) {
  process.nextTick(function () {
    Userlog.create({
      userid: req.user.id,
      logjson: req.body
    }).then(function (userlog) {
      res.status(201).json({
        message: "new log created",
        body: userlog.dataValues
      });
    })["catch"](function (err) {
      next((0, _utils.genError)("cannot post log", null, 500));
    });
  });
});
router.get('/', getUserByApi, function (req, res, next) {
  process.nextTick(function () {
    Userlog.findAll({
      where: {
        userid: req.user.id
      }
    }).then(function (results) {
      // console.log(results);
      var logs = [];
      results.forEach(function (l) {
        logs.push(l.logjson);
      });
      res.status(200).json({
        message: "success",
        logs: logs
      });
    })["catch"](function (err) {
      next((0, _utils.genError)("cannot retrieve all logs", err.message, 500));
    });
  });
});

function getUserByApi(req, res, next) {
  process.nextTick(function () {
    User.findOne({
      where: {
        apikey: req.query.apikey
      }
    }).then(function (user) {
      if (!user) {
        next((0, _utils.genError)("not found", "cannot create log using apikey ".concat(req.query.apikey), 404));
      }

      req.user = user;
      next();
    })["catch"](function (err) {
      next((0, _utils.genError)("error post new log", err.message, 500));
    });
  });
}

var _default = router;
exports["default"] = _default;