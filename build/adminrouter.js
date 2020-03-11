"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _index = require("../models/index");

var _sequelize = require("sequelize");

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Userlog = require('../models/userlog')(_index.sequelize, _sequelize.DataTypes);

var router = (0, _express.Router)();

function getLogs(req, res, next) {
  process.nextTick(function () {
    var page = req.page,
        limit = req.limit,
        calcoffset = req.calcoffset;
    Userlog.findAndCountAll({
      where: {
        userid: res.data.user.id
      },
      limit: [calcoffset, limit],
      order: [['createdAt', 'DESC']]
    }).then(function (result) {
      var logs = [];
      var rownum = calcoffset + 1;
      result.rows.forEach(function (l) {
        l.logjson.rownum = rownum;
        logs.push(l.logjson);
        rownum++;
      });
      res.logs = logs;
      res.totalpage = Math.ceil(result.count / limit);
      res.count = result.count;
      next();
    })["catch"](function (err) {
      next(genError("cannot retrieve all logs", err.message, 500));
    });
  });
}

router.get('/live', function (req, res, next) {
  req.page = req.query.page ? parseInt(req.query.page) : 1;
  req.limit = req.query.limit ? parseInt(req.query.limit) : 100;
  req.calcoffset = (req.page - 1) * req.limit;
  next();
}, getLogs, function (req, res, next) {
  var tempLog = [];
  res.logs.forEach(function (v) {
    delete v.rownum;
    v.timestamp = (0, _moment["default"])(v.timestamp).toISOString();
    tempLog.push({
      message: JSON.stringify(v, null, 2)
    });
  });
  res.data.logs = tempLog;
  res.render('loggerlive', {
    title: "Live logger for ".concat(res.data.user.username),
    data: res.data
  });
});
router.get('/profile', function (req, res, next) {
  res.render('profile', {
    title: "Profile page of ".concat(res.data.user.username),
    data: res.data
  });
});
var _default = router;
exports["default"] = _default;