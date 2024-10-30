const { analyzeImage, extractTextFromImage } = require('../services/azureVisionService');
const { extractDetails, extractUser, extractType, extractContract, extractMoreData, extractRecord } = require('../services/geminiService');

const analyzeImageHandler = async (req, res) => {
  if (!req.file || !req.file.mimetype.startsWith('image/')) {
    return res.status(400).json({ éxito: false, mensaje: 'Por favor, sube un archivo de imagen válido.' });
  }

  const imageBuffer = req.file.buffer;

  try {
    const analysisResult = await analyzeImage(imageBuffer);
    res.json({ éxito: true, datos: analysisResult });
  } catch (error) {
    console.error('Error al analizar la imagen:', error.message);  // Error detallado
    res.status(500).json({ éxito: false, mensaje: 'Error al analizar la imagen. Por favor, intenta nuevamente más tarde.', error: error.message });
  }
};

const extractTextHandler = async (req, res) => {
  if (!req.file || !req.file.mimetype.startsWith('image/')) {
    return res.status(400).json({ éxito: false, mensaje: 'Por favor, sube un archivo de imagen válido.' });
  }

  const imageBuffer = req.file.buffer;
  const imageData = imageBuffer.toString('base64');

  try {
    const ocrResult = await extractTextFromImage(imageBuffer);

    const extractedText = ocrResult.regions
      .map(region => region.lines.map(line => line.words.map(word => word.text).join(' ')).join(' '))
      .join(' ');
    
    console.log('\nTexto extraido: \n', extractedText, '\n');  
      
    // Extraer el precio y el beneficiario de la factura en consultas separadas
    const tipo = await extractType(extractedText);
    const contrato = await extractContract(extractedText);
    const precio = await extractDetails(extractedText);
    const beneficiario = await extractUser(extractedText);
    const moreDetails = await extractMoreData(extractedText, imageData);
    const record = await extractRecord(imageData);

    if (precio || beneficiario || tipo || contrato) {
      res.json({ éxito: true, textoExtraído: contrato, tipo, precio, beneficiario, moreDetails, record });
    } else {
      res.json({ éxito: true, textoExtraído: extractedText, mensaje: 'No se encontraron datos válidos en el texto.' });
    }
  } catch (error) {
    console.error('Error al extraer o analizar el texto:', error);
    res.status(500).json({ éxito: false, mensaje: 'Error al extraer el texto. Por favor, intenta nuevamente más tarde.' });
  }
};

module.exports = { analyzeImageHandler, extractTextHandler };