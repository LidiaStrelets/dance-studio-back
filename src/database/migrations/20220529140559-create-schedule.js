'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('schedules', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      coach_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      class_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hall_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date_time: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('schedules');
  },
};
