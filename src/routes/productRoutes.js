const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const upload = require('../config/multer');

// Rota pública (qualquer um vê os produtos)
router.get('/', productController.index);

// A partir daqui precisa estar logado
router.use(authMiddleware);

// A partir daqui precisa ser ADMIN
router.use(isAdmin);

router.post('/', upload.single('image'), productController.store);
router.put('/:id', upload.single('image'), productController.update);
router.delete('/:id', productController.delete);

module.exports = router;