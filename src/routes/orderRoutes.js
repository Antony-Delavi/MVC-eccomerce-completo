const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

// Rota pública: qualquer pessoa pode finalizar compra (guest checkout)
router.post('/orders', orderController.store);

// A partir daqui precisa estar logado
router.use(authMiddleware);

// Rotas protegidas
router.get('/my-orders', orderController.myOrders);

// Apenas ADMIN vê o histórico completo de vendas
router.get('/orders', isAdmin, orderController.index);

module.exports = router;