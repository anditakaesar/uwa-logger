"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _umzug = _interopRequireDefault(require("umzug"));

var _index = require("../models/index");

var _sequelize = _interopRequireDefault(require("sequelize"));

var _utils = require("./utils");

var _env = require("./env");

var _logger = _interopRequireDefault(require("./logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// migration router
var router = (0, _express.Router)();
var umzug = new _umzug["default"]({
  storage: 'sequelize',
  storageOptions: {
    sequelize: _index.sequelize
  },
  migrations: {
    params: [_index.sequelize.getQueryInterface(), _sequelize["default"]],
    path: './migrations'
  }
});
router.get('/', CheckQueryStringSecret, GetExecutedMigration, GetPendingMigration, function (req, res, next) {
  process.nextTick(function () {
    res.status(200).json({
      message: "all migrations",
      migrations: res.migrations
    });
  });
});
router.post('/:method', CheckQueryStringSecret, function (req, res, next) {
  var method = req.params.method;

  if (method === 'up') {
    res.donemsg = "migrated";
    next();
  } else if (method === 'down') {
    res.donemsg = "undo migration";
    next();
  } else {
    next((0, _utils.genError)("not found", "method router attempt", 404));
  }
}, function (req, res, next) {
  process.nextTick(function () {
    var migs = req.body.migrations ? _toConsumableArray(req.body.migrations) : [];

    _logger["default"].info("attempt to ".concat(res.donemsg), {
      migrations: migs
    });

    umzug.execute({
      migrations: migs,
      method: req.params.method
    }).then(function (mgtns) {
      var migrations = [];
      mgtns.forEach(function (m) {
        return migrations.push(m.file);
      });
      res.status(200).json({
        message: res.donemsg,
        migrations: migrations
      });
    })["catch"](function (err) {
      next((0, _utils.genError)("error migrating", err.message));
    });
  });
});

function CheckQueryStringSecret(req, res, next) {
  if (req.query.api === _env.env.MIGRATION_API) {
    next();
  } else {
    next((0, _utils.genError)("not found", "migration api attempt", 404));
  }
}

function GetExecutedMigration(req, res, next) {
  process.nextTick(function () {
    umzug.executed().then(function (mgtd) {
      var migrations = res.migrations ? _toConsumableArray(res.migrations) : [];
      mgtd.forEach(function (m) {
        return migrations.push({
          name: m.file,
          status: 'migrated'
        });
      });
      res.migrations = migrations;
      next();
    })["catch"](function (err) {
      next((0, _utils.genError)("Error get executed migrations", err.message));
    });
  });
}

function GetPendingMigration(req, res, next) {
  process.nextTick(function () {
    umzug.pending().then(function (pndg) {
      var migrations = res.migrations ? _toConsumableArray(res.migrations) : [];
      pndg.forEach(function (m) {
        return migrations.push({
          name: m.file,
          status: 'pending'
        });
      });
      res.migrations = migrations;
      next();
    })["catch"](function (err) {
      next((0, _utils.genError)("Error get pending migrations", err.message));
    });
  });
}

var _default = router;
exports["default"] = _default;