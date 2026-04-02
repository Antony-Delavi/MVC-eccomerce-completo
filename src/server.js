require('dotenv').config();                    // ← Carrega variáveis de ambiente primeiro

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const sequelize = require('./config/database');

// Importação das rotas
const routes = require('./routes/index');           // Auth + orders públicas
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// ====================== SEGURANÇA ======================

// 1. Helmet - Configura headers de segurança importantes
app.use(helmet({
  contentSecurityPolicy: false, // Vamos configurar manualmente se quiser CSP forte depois
  crossOriginEmbedderPolicy: false
}));

// 2. CORS - Mais restrito (melhor que aberto)
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // ajuste conforme necessário
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 3. Rate Limiting (protege contra brute-force no login e cadastro)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,                 // máximo 100 requisições por IP
  message: { error: 'Muitas requisições. Aguarde alguns minutos e tente novamente.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Aplica rate limit mais forte nas rotas de autenticação
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,                  // apenas 10 tentativas de login/cadastro por 15 min
  message: { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' }
});

// 4. Middlewares básicos
app.use(express.json({ limit: '5mb' }));           // Limita tamanho do JSON
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(morgan('dev'));                            // Log de requisições

// ====================== ROTAS ======================

// Aplica rate limit nas rotas de autenticação
app.use('/api/login', authLimiter);
app.use('/api/register', authLimiter);
app.use('/api', apiLimiter);   // Limite geral para todas as rotas /api

// Rotas principais
app.use('/api/products', productRoutes);   // Produtos (já tem middlewares internos)
app.use('/api', routes);                   // Auth + orders públicas
app.use('/api', orderRoutes);              // Orders protegidas

// Servir arquivos estáticos de upload
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, 'public')));

// Rotas de páginas HTML (Frontend)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ====================== TRATAMENTO DE ERROS ======================
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Erro interno no servidor' 
      : err.message,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ====================== INICIALIZAÇÃO ======================
const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false })   // ← Mudei para false para não apagar o banco toda vez
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📂 Banco SQLite sincronizado.`);
      console.log(`🔒 Modo: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch(err => {
    console.error('❌ Erro ao conectar ao banco:', err);
  });

module.exports = app; // útil para testes