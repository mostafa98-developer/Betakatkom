'use strict';
const sequelize = require("sequelize");
const { DataTypes } = sequelize;
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('CardTypes', 'profitA', { type: DataTypes.DOUBLE, defaultValue: 0 });
    await queryInterface.addColumn('CardTypes', 'profitB', { type: DataTypes.DOUBLE, defaultValue: 0 });
    await queryInterface.addColumn('CardTypes', 'profitC', { type: DataTypes.DOUBLE, defaultValue: 0 });
    await queryInterface.addColumn('Wallets', 'profit', { 
      type: DataTypes.DOUBLE.UNSIGNED,
      allowNull: false,
      defaultValue: 0, 
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('CardTypes', 'profitA', { });
    await queryInterface.removeColumn('CardTypes', 'profitB', { });
    await queryInterface.removeColumn('CardTypes', 'profitC', { });
    await queryInterface.removeColumn('Wallets', 'profit', { });
  }
  
};
