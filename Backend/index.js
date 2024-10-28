const express = require('express');
const cors = require('cors'); 
const imageRoutes = require('./routes/imageRoutes');

const app = express();

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:5173' // Reemplaza con la URL del frontend
}));

app.use('/', imageRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
