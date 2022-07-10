'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('registrations', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      schedule_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      client_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('registrations');
  },
};
