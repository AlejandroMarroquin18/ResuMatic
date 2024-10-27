const { analyzeImage, extractTextFromImage } = require('../services/azureVisionService');

// Controlador para analizar imágenes
const analyzeImageHandler = async (req, res) => {
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

// Controlador para extraer texto usando OCR
const extractTextHandler = async (req, res) => {
    if (!req.file || !req.file.mimetype.startsWith('image/')) {
      return res.status(400).send('Por favor, sube un archivo de imagen válido.');
    }
  
    const imageBuffer = req.file.buffer;
  
    try {
      const ocrResult = await extractTextFromImage(imageBuffer);
  
      // Recorrer las regiones, líneas y palabras para concatenar todo el texto en una sola línea
      const extractedText = ocrResult.regions
        .map(region => region.lines.map(line => line.words.map(word => word.text).join(' ')).join(' '))
        .join(' ');
  
      res.json({ éxito: true, textoExtraído: extractedText });
    } catch (error) {
      console.error('Error al extraer texto de la imagen:', error);
      res.status(500).send('Error al extraer el texto. Por favor, intenta nuevamente más tarde.');
    }
  };  

module.exports = { analyzeImageHandler, extractTextHandler };