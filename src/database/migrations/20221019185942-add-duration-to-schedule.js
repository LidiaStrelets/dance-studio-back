'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('schedules', 'duration', {
      type: Sequelize.INTEGER,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('schedules', 'duration');
  },
};
