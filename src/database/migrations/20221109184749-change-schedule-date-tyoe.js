'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('schedules', 'date_time');
    await queryInterface.addColumn('schedules', 'date_time', {
      type: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('schedules', 'date_time');
    await queryInterface.addColumn('schedules', 'date_time', {
      type: Sequelize.STRING,
    });
  },
};
