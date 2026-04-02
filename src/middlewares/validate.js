const validate = (schema) => (req, res, next) => {
  // Se o schema não chegar aqui, ele dá o erro que você viu
  if (!schema) {
    console.error("❌ O middleware recebeu um schema UNDEFINED!");
    return res.status(500).json({ error: "Erro na configuração do validador." });
  }
  
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Dados inválidos', details: result.error.format() });
  }
  
  req.body = result.data;
  next();
};

module.exports = validate;