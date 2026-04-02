const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: 'Token não enviado' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
    return res.status(401).json({ error: 'Token malformatado' });
  }

  try {
    const decoded = jwt.verify(parts[1], process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;        // ← NOVO: agora temos o role no request
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};