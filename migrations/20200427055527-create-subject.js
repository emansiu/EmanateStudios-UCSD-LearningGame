'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Subjects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      number: {
        type: Sequelize.INTEGER
      },
      initials: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      consent: {
        type: Sequelize.BOOLEAN
      },
      age: {
        type: Sequelize.INTEGER
      },
      gender: {
        type: Sequelize.STRING
      },
      demographic: {
        type: Sequelize.STRING
      },
      timesQuizFailed: {
        type: Sequelize.INTEGER
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Subjects');
  }
};