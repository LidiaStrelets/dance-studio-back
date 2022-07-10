'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('roles', [
      {
        title: 'admin',
        description: 'dumb text',
        id: '6efdb8f3-4997-44ec-a543-703051fe9404',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roles', null, {});
  },
};
