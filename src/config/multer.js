const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Caminho absoluto para a pasta uploads (na raiz do projeto)
const uploadsDir = path.resolve(__dirname, '../../uploads');

// Garante que a pasta existe (cria se não existir)
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Pasta uploads criada automaticamente em:', uploadsDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);   // Usa o caminho absoluto
    },
    filename: (req, file, cb) => {
        const hash = crypto.randomBytes(6).toString('hex');
        const fileName = `${hash}-${file.originalname}`;
        cb(null, fileName);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // opcional: limite de 5MB
    fileFilter: (req, file, cb) => {
        // Opcional: aceitar apenas imagens
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de arquivo não permitido. Apenas imagens são aceitas.'));
        }
    }
});

module.exports = upload;