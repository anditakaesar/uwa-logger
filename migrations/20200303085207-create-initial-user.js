'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const password = bcrypt.hashSync('admin', 8);

    return queryInterface.bulkInsert('Users', [{
      username: 'admin',
      email: 'admin@email.com',
      password: password,
      apikey: 'this-is-api',
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', {
      username: 'admin'
    });
  }
};
