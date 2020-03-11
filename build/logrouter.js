"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _index = require("../models/index");

var _sequelize = require("sequelize");

var _utils = require("./utils");

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var User = require('../models/user')(_index.sequelize, _sequelize.DataTypes);

var Userlog = require('../models/userlog')(_index.sequelize, _sequelize.DataTypes);

var router = (0, _express.Router)();
router.post('/', getUserIdByApi, function (req, res, next) {
  process.nextTick(function () {
    req.body.timestamp = (0, _moment["default"])(req.body.timestamp).valueOf();
    req.body.ip = req.ip || req.headers["x-forwarded-for"];
    Userlog.create({
      userid: req.userid,
      logjson: req.body
    }).then(function (userlog) {
      console.log(req.apikey);
      userlog.logjson.timestamp = (0, _moment["default"])(userlog.logjson.timestamp).toISOString();
      req.io.emit("log_".concat(req.apikey), userlog.logjson);
      res.status(201).json({
        message: "new log created",
        log: userlog.dataValues
      });
    })["catch"](function (err) {
      next((0, _utils.genError)("cannot post log", err.message, 500));
    });
  });
});

function getUserIdByApi(req, res, next) {
  process.nextTick(function () {
    User.findOne({
      where: {
        apikey: req.query.apikey
      }
    }).then(function (user) {
      if (!user) {
        next((0, _utils.genError)("not found", "api key: \"".concat(req.query.apikey, "\""), 404));
      }

      req.userid = user.id;
      req.apikey = req.query.apikey;
      next();
    })["catch"](function (err) {
      next((0, _utils.genError)("not found", err.message, 404));
    });
  });
}

var _default = router;
exports["default"] = _default;