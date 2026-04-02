const Product = require('../models/Product');
const fs = require('fs'); // Para deletar fotos antigas se necessário
const path = require('path');

module.exports = {
  // Lista todos os produtos (Vitrine e Admin)
  async index(req, res) {
    try {
      const { category } = req.query;
      let filter = {};

      if (category && category !== 'Todos') {
        filter = { where: { category: category } };
      }

      const products = await Product.findAll(filter);
      return res.json(products);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar produtos.' });
    }
  },

  // Cria um novo produto com UPLOAD DE IMAGEM
  async store(req, res) {
    try {
      const { name, price, stock, category } = req.body;
      
      // O Multer coloca os dados do arquivo em req.file
      // Se houver arquivo, salvamos o caminho relativo, senão, null ou uma imagem padrão
      const image_url = req.file ? `/uploads/${req.file.filename}` : null;

      const product = await Product.create({
        name,
        price,
        stock,
        category,
        image_url // Agora salva o caminho do nosso servidor
      });

      return res.status(201).json(product);
    } catch (error) {
      console.error("Erro no Store:", error);
      return res.status(400).json({ error: 'Erro ao cadastrar produto.' });
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
      return res.json(product);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar produto' });
    }
  },

  // Atualiza produto (Permite trocar a foto também)
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, price, stock, category } = req.body;
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      // Lógica da imagem: Se enviou arquivo novo, usa o novo. 
      // Se não enviou, mantém o que já estava no banco.
      let image_url = product.image_url;
      if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
      }

      await product.update({
        name,
        price,
        stock,
        category,
        image_url
      });

      return res.json(product);
    } catch (error) {
      console.error("Erro no Update:", error);
      return res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
  },

  // Exclui produto
  async delete(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);

      if (!product) return res.status(404).json({ error: 'Produto não encontrado' });

      // Opcional: Deletar o arquivo físico da pasta uploads ao excluir do banco
      if (product.image_url) {
        const filePath = path.resolve(__dirname, '../../', product.image_url.substring(1));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      await product.destroy();
      return res.json({ message: 'Produto removido com sucesso!' });
    } catch (error) {
      console.error("Erro no Delete:", error);
      return res.status(500).json({ error: 'Erro ao excluir produto' });
    }
  }
};