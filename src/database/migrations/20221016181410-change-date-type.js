'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'birth_date');
    await queryInterface.addColumn('users', 'birth_date', {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'birth_date');
    await queryInterface.addColumn('users', 'birth_date', {
      type: Sequelize.DATE,
    });
  },
};
