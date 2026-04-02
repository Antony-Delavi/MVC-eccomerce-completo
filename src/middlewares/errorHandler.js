module.exports = (err, req, res, next) => {
  console.error(err.stack); // Log para o desenvolvedor ver no terminal

  const status = err.status || 500;
  const message = err.message || 'Erro interno no servidor';

  return res.status(status).json({
    success: false,
    error: message,
    // Se estiver em desenvolvimento, mostra detalhes, senão esconde
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};