'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn('personals', 'message');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'personals',
      'message',
      Sequelize.TEXT('long'),
    );
  },
};
