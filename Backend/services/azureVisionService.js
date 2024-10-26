require('dotenv').config(); 

const axios = require('axios');

const azureVisionService = {
  endpoint: process.env.AZURE_COMPUTER_VISION_ENDPOINT,
  subscriptionKey: process.env.AZURE_COMPUTER_VISION_KEY,
};

//Analiza la imagen
async function analyzeImage(imageBuffer) {
  try {
    const response = await axios.post(
      `${azureVisionService.endpoint}/vision/v3.2/analyze?visualFeatures=Categories,Description,Color`,
      imageBuffer,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': azureVisionService.subscriptionKey,
          'Content-Type': 'application/octet-stream',
        },
        params: {
            'language': 'es', // Establecer idioma español
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al llamar a la API de Azure:', error.response ? error.response.data : error.message);
    throw new Error('Error al analizar la imagen.');
  }
}

//Extrae el texto de la imagen con OCR
async function extractTextFromImage(imageBuffer) {
    try {
      const response = await axios.post(
        `${azureVisionService.endpoint}/vision/v3.2/ocr`, // URL para el servicio OCR
        imageBuffer,
        {
          headers: {
            'Ocp-Apim-Subscription-Key': azureVisionService.subscriptionKey,
            'Content-Type': 'application/octet-stream',
          },
          params: {
            'language': 'es', // Puedes cambiar esto según el idioma de los textos en las imágenes
            'detectOrientation': 'true', // Detectar automáticamente la orientación del texto
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al llamar a la API de Azure OCR:', error.response ? error.response.data : error.message);
      throw new Error('Error al extraer el texto de la imagen.');
    }
  }
  
module.exports = { analyzeImage, extractTextFromImage };