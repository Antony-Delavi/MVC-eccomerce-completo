const { Router } = require('express');
const routes = Router();
const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');   // ← Adicione esta linha

// Rotas públicas de auth
routes.post('/register', authController.register);
routes.post('/login', authController.login);

// ← Adicione esta linha aqui (rota pública de pedido)
routes.post('/orders', orderController.store);

module.exports = routes;