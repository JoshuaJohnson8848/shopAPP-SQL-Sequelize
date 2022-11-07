const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const CartItems = sequelize.define('cartItems', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: Sequelize.INTEGER,
});

module.exports = CartItems;
