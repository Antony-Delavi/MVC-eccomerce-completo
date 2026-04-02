const User = require('../models/User'); // Ajustado para 'User' (singular como no seu model)
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = 'SUA_CHAVE_SECRETA'; // Idealmente, use process.env.JWT_SECRET

module.exports = {
    // REGISTRO: Cria o usuário (como 'customer' por padrão)
    async register(req, res) {
        try {
            const { name, email, password } = req.body;

            const userExists = await User.findOne({ where: { email } });
            if (userExists) {
                return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
            }

            // O campo 'role' será 'customer' automaticamente pelo defaultValue do Model
            const user = await User.create({ name, email, password });

            return res.status(201).json({
                message: "Usuário criado com sucesso!",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao processar cadastro.' });
        }
    },

    // LOGIN: Entrega Token + Role para o Frontend
    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
            }

            // Geramos o Token incluindo o ID e o ROLE no payload
            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '12h' }        // ← Reduzi de 1 dia para 12h (mais seguro)
            );

            // RETORNO COMPLETO PARA O FRONTEND
            return res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role // Fundamental para o redirecionamento
                }
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro interno no login.' });
        }
    }
};