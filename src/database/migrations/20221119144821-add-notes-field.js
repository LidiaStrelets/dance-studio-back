'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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

  async down(queryInterface) {
    await queryInterface.removeColumn('schedules', 'notes');
    await queryInterface.removeColumn('personals', 'notes');
  },
};
