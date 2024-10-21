const express = require('express');
const multer = require('multer');
const { analyzeImageHandler } = require('../controllers/imageController');

const router = express.Router();
const upload = multer(); // Para procesar archivos en memoria

// Ruta para analizar imágenes
router.post('/analyze-image', upload.single('image'), analyzeImageHandler);

module.exports = router;