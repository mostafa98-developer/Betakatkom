'use strict';
const sequelize = require("sequelize");
const { DataTypes } = sequelize;

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('Transactions', 'stockTaken', { type: DataTypes.BOOLEAN, defaultValue: false });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Transactions', 'stockTaken', { });
  }
};
