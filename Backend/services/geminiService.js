const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');


dotenv.config();

// Inicializar Gemini con la clave API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

async function extractType(text) {
  let tipoFactura = null;

  try {

    // Prompt para obtener uno o más tipos de servicios en la factura
    const prompt = `Tengo un texto extraído de una factura. Mi objetivo es identificar el tipo de servicio o servicios de la factura, que pueden ser uno o varios de los siguientes: agua, energía, internet, gas, o televisión (tv).

    El texto extraído es el siguiente:

    "${text}"

    Necesito que ANALICES CUIDADOSAMENTE el texto de la factura. Quiero que retornes un NÚMERO, de acuerdo al tipo de factura así:

    "agua": 1,
    "energía": 2,
    "internet": 3,
    "gas": 4,
    "tv": 5,
    "agua y energía": 6,
    "agua, energía e internet": 7,
    "tv, internet": 8,
    "ninguno": 9

    Ejemplos de respuesta:

    1
    3
    5

    ES MUY IMPORTANTE QUE SOLO RETORNES UN NÚMERO.

    Aumenta la precisión para que solo el tipo o tipos de servicio identificados sean devueltos en el formato indicado.`;

    // Enviar el prompt al modelo
    const result = await model.generateContent(prompt);
 
    // Almacenar directamente el texto de la respuesta
    tipoFactura = result.response.text().trim();
    console.log('Tipo de factura extraído:', tipoFactura);

  } catch (error) {
    console.error('Error extrayendo el tipo de la factura:', error);
  }

  return tipoFactura;
}

async function extractContract(text) {
    let contrato = null;
  
    try {

      const prompt = `Tengo un texto extraído de una factura. Mi objetivo es identificar el número de contrato o de pago de la misma.
  
      El texto extraído es el siguiente:
  
      "${text}"
  
      Necesito que ANALICES CUIDADOSAMENTE el texto de la factura. Quiero que retornes un NÚMERO, que debe ser SOLAMENTE EL NÚMERO DE CONTRATO de la factura.
      Este número usualmente lo consigues como CONTRATO: numero.
  
      Ejemplos de respuesta:
  
      7133247
      7462
  
      ES MUY IMPORTANTE QUE SOLO RETORNES UN NÚMERO.
  
      Aumenta la precisión para que solo el tipo o tipos de servicio identificados sean devueltos en el formato indicado.`;
  
      // Enviar el prompt al modelo
      const result = await model.generateContent(prompt);
  
      // Almacenar directamente el texto de la respuesta
      contrato = result.response.text().trim();
      console.log('Número de pago o contrato:', contrato);
  
    } catch (error) {
      console.error('Error extrayendo el contrato:', error);
    }
  
    return contrato;
}

async function extractDetails(text) {
    let precio = null;

    try {
 
      // Prompt modificado para obtener solo el precio sin etiquetas
      const prompt = `Tengo un texto extraído de una factura. Mi objetivo es obtener el precio total de la factura.
  
      El texto extraído es el siguiente:
  
      "${text}"
  
      Necesito que respondas SOLAMENTE el monto total que aparece en el texto. ESTO ES DE GRAN IMPORTANCIA.
  
      POR EJEMPLO:
  
      123.45
  
      Aumenta la precisión para que solo el precio total sea devuelto en el formato indicado.`;
   
      // Enviar el prompt al modelo
      const result = await model.generateContent(prompt);
 
      // Almacenar directamente el texto de la respuesta
      precio = result.response.text().trim();
      console.log('Precio extraído:', precio);
  
    } catch (error) {
      console.error('Error extrayendo el precio de la factura:', error);
    }
  
    return precio;
}

async function extractUser(text) {
  let beneficiario = null;

  try {

    // Prompt modificado para obtener solo el nombre del beneficiario sin etiquetas
    const prompt = `Tengo un texto extraído de una factura. Mi objetivo es obtener el nombre del beneficiario de la factura.

    El texto extraído es el siguiente:

    "${text}"

    Necesito que respondas SOLAMENTE el nombre del beneficiario que aparece en el texto. ESTO ES DE GRAN IMPORTANCIA.

    POR EJEMPLO:

    Juan Pérez

    Aumenta la precisión para que solo el nombre del beneficiario sea devuelto en el formato indicado.`;

    // Enviar el prompt al modelo
    const result = await model.generateContent(prompt);

    // Almacenar directamente el texto de la respuesta
    beneficiario = result.response.text().trim();
    console.log('Beneficiario extraído:', beneficiario);

  } catch (error) {
    console.error('Error extrayendo el beneficiario de la factura:', error);
  }

  return beneficiario;
}


async function extractMoreData(text, imageData) {
  let moreData = null;

  try {
    const prompt = `Tengo un texto extraído de una factura. Mi objetivo es obtener el nombre del beneficiario de la factura.

    El texto extraído es el siguiente:

    "${text}"
    
    Necesito que respondas SOLAMENTE respondas 
      la empresa encargada, 
      la fecha de pago, 
      la fecha de suspension, 
      consumo anterior, 
      consumo actual, 
      consumo del periodo, 
      ultimo pago realizado y 
      valor del ultimo pago. 
      
    Separadas por "-", en caso de no encontrar un dato, buscarlos en la imagen, y si aun asi no se encuentra, establecer en su seccion "No se encontro informacion". ESTO ES DE GRAN IMPORTANCIA.

    POR EJEMPLO:

    Celsia-25 de septiembre-No se encontro informacion-178-200-180-27 de agosto 2025-100,250.00

    Aumenta la precisión para que solo el nombre del beneficiario sea devuelto en el formato indicado.`;

    const image = {
      inlineData: {
        data: imageData,
        mimeType: "image/jpeg",
      },
    };
    const result = await model.generateContent([prompt, image]);
    moreData = result.response.text();

  } catch (error) {
    console.log('Error extrayendo los demas datos:', error)
  }

  return moreData;

}

async function extractRecord(imageData) {
  let record = [];

  try {

    const prompt = `Necesito que respondas SOLAMENTE los 3 ultimos meses y su gasto, ademas separalo por comas. ESTO ES DE GRAN IMPORTANCIA.

    POR EJEMPLO:

    MAYO-31, JUNIO-18, JULIO-20

    Aumenta la precisión para que solo el nombre del beneficiario sea devuelto en el formato indicado.`;

    const image = {
      inlineData: {
        data: imageData,
        mimeType: "image/jpeg",
      },
    };
    const result = await model.generateContent([prompt, image]);
    data = result.response.text();
    
    const items = data.split(", ");

    items.forEach(item => {
      const [month, value] = item.split("-");
      record.push({name: month, consumo: parseInt(value, 10)});
    });

  } catch(error) {
    console.error('Error extrayendo el registro:', error);
  }

  console.log(record);
  return record;
}

module.exports = { extractDetails, extractUser, extractType, extractContract, extractMoreData, extractRecord};