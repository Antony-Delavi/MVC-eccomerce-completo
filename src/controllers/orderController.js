const Order = require('../models/Order');
const Product = require('../models/Product');
const sequelize = require('../config/database');

module.exports = {
  async store(req, res) {
    const t = await sequelize.transaction();

    try {
      // Agora recebemos 'customer' (objeto) em vez de apenas 'customerName'
      const { items, total, customer } = req.body;

      // Validações básicas
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Carrinho vazio.' });
      }
      if (!customer || !customer.email || !customer.name) {
        return res.status(400).json({ error: 'Dados do cliente são obrigatórios.' });
      }

      // 1. Validar estoque antes de qualquer alteração
      for (const item of items) {
        const product = await Product.findByPk(item.id, { transaction: t });

        if (!product) {
          await t.rollback();
          return res.status(404).json({ error: `Produto ${item.id} não existe.` });
        }

        if (product.stock < item.quantity) {
          await t.rollback();
          return res.status(400).json({
            error: `Estoque insuficiente: ${product.name}. Disponível: ${product.stock}`
          });
        }
      }

      // 2. Criar o pedido salvando o cliente completo
      const order = await Order.create({
        customerData: JSON.stringify(customer), // Salva nome, email, tel e endereço
        items: JSON.stringify(items),
        total: Number(total),
        status: 'Concluído'
      }, { transaction: t });

      // 3. Baixar o estoque
      for (const item of items) {
        const product = await Product.findByPk(item.id, { transaction: t });
        await product.update({
          stock: product.stock - item.quantity
        }, { transaction: t });
      }

      await t.commit();

      return res.status(201).json({
        message: "Pedido finalizado!",
        orderId: order.id
      });

    } catch (error) {
      if (t) await t.rollback();
      console.error("Erro no Checkout:", error);
      return res.status(500).json({ error: 'Erro ao processar a venda.' });
    }
  },

  async index(req, res) {
    try {
      const orders = await Order.findAll({
        order: [['createdAt', 'DESC']]
      });
      return res.json(orders);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar histórico.' });
    }
  },
  async myOrders(req, res) {
    try {
      const orders = await Order.findAll({
        where: { userId: req.userId }, // req.userId vem do authMiddleware
        order: [['createdAt', 'DESC']]
      });
      return res.json(orders);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar seus pedidos.' });
    }
  }
};