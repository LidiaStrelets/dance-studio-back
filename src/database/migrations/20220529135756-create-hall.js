'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('halls', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      nameUk: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      descriptionUk: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      poles_amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      picture: {
        type: Sequelize.STRING,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('halls');
  },
};
