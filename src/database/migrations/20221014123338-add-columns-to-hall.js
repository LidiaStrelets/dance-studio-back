'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('halls', 'nameUk', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('halls', 'descriptionUk', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('halls', 'picture', {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('halls', 'name-uk');
    await queryInterface.removeColumn('halls', 'description-uk');
    await queryInterface.removeColumn('halls', 'picture');
  },
};
