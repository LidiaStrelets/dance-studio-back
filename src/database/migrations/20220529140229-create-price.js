'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('prices', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      classes_amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('prices');
  },
};
