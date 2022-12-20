'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn('schedules', 'notes');
    await queryInterface.removeColumn('personals', 'notes');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'schedules',
      'notes',
      Sequelize.TEXT('long'),
    );
    await queryInterface.addColumn(
      'personals',
      'notes',
      Sequelize.TEXT('long'),
    );
  },
};
