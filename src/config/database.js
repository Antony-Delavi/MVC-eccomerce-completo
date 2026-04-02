const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './src/database/database.sqlite',
  logging: process.env.NODE_ENV === 'development'
});

module.exports = sequelize;