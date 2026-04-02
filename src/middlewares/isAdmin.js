module.exports = (req, res, next) => {
  if (!req.userId || req.userRole !== 'admin') {   // req.userRole vamos adicionar no authMiddleware
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  next();
};