const express = require('express');
const imageRoutes = require('./routes/imageRoutes');

const app = express();

app.use('/', imageRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});