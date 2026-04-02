const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  userId: { // Novo campo para vincular ao cliente logado
    type: DataTypes.INTEGER,
    allowNull: true, // Permite nulo para compras de visitantes se desejar
  },
  customerData: { type: DataTypes.TEXT, allowNull: false },
  items: { type: DataTypes.TEXT, allowNull: false },
  total: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Pendente' }
});

module.exports = Order;