const { analyzeImage } = require('../services/azureVisionService');

const analyzeImageHandler = async (req, res) => {
  // Verificar el archivo y validar su tipo
  if (!req.file || !req.file.mimetype.startsWith('image/')) {
      return res.status(400).send('Por favor, sube un archivo de imagen válido.');
  }

  const imageBuffer = req.file.buffer;

  try {
    const analysisResult = await analyzeImage(imageBuffer);
    res.json({ éxito: true, datos: analysisResult });
  } catch (error) {
    console.error('Error al analizar la imagen:', error);
    res.status(500).send('Error al analizar la imagen. Por favor, intenta nuevamente más tarde.');
  }
};

module.exports = { analyzeImageHandler };