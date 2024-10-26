const express = require('express');
const multer = require('multer');
const { analyzeImageHandler, extractTextHandler } = require('../controllers/imageController');

const router = express.Router();
const upload = multer(); // Para procesar archivos en memoria

// Ruta para analizar imágenes
router.post('/analyze-image', upload.single('image'), analyzeImageHandler);

// Nueva ruta para extraer texto con OCR
router.post('/extract-text', upload.single('image'), extractTextHandler);

module.exports = router;