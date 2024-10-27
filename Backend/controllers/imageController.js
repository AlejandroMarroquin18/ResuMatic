const { analyzeImage, extractTextFromImage } = require('../services/azureVisionService');
const { extractDetails, extractUser, extractType, extractContract } = require('../services/geminiService');

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

    const extractedText = ocrResult.regions
      .map(region => region.lines.map(line => line.words.map(word => word.text).join(' ')).join(' '))
      .join(' ');

    // Extraer el precio y el beneficiario de la factura en consultas separadas
    const tipo = await extractType(extractedText);
    const contrato = await extractContract(extractedText);
    const precio = await extractDetails(extractedText);
    const beneficiario = await extractUser(extractedText);

    if (precio || beneficiario || tipo || contrato) {
      res.json({ éxito: true, textoExtraído: contrato, tipo, precio, beneficiario });
    } else {
      res.json({ éxito: true, textoExtraído: extractedText, mensaje: 'No se encontraron datos válidos en el texto.' });
    }
  } catch (error) {
    console.error('Error al extraer o analizar el texto:', error);
    res.status(500).send('Error al extraer el texto. Por favor, intenta nuevamente más tarde.');
  }
};

module.exports = { analyzeImageHandler, extractTextHandler, };