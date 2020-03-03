'use strict';
module.exports = (sequelize, DataTypes) => {
  const Userlog = sequelize.define('Userlog', {
    userid: DataTypes.INTEGER,
    logjson: DataTypes.JSON
  }, {});
  Userlog.associate = function(models) {
    // associations can be defined here
  };
  return Userlog;
};