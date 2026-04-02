const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true,
    validate: { isEmail: true } // Garante que o e-mail seja válido
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  // Novo campo: Define o nível de acesso
  role: {
    type: DataTypes.ENUM('admin', 'customer'),
    defaultValue: 'customer' // Todo novo registro padrão é um cliente
  }
}, {
  hooks: {
    // Criptografa a senha antes de criar ou atualizar
    beforeSave: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 8);
      }
    }
  }
});

module.exports = User;