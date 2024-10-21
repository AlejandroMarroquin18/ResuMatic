require('dotenv').config(); 

const axios = require('axios');

const azureVisionService = {
  endpoint: process.env.AZURE_COMPUTER_VISION_ENDPOINT,
  subscriptionKey: process.env.AZURE_COMPUTER_VISION_KEY,
};

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
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al llamar a la API de Azure:', error.response ? error.response.data : error.message);
    throw new Error('Error al analizar la imagen.');
  }
}

module.exports = { analyzeImage };