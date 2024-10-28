// ResuMatic.jsx
import React, { useState } from 'react';
import { Box, Button, Typography, Tabs, Tab, Card, CardContent, CardHeader } from '@mui/material';

export default function ResuMatic() {
  const [file, setFile] = useState(null);
  const [billData, setBillData] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const analyzeImage = async () => {
    if (!file) return alert('Por favor, selecciona una imagen primero.');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:3000/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.mensaje || 'Error desconocido');
        return;
      }

      const data = await response.json();
      setBillData(data.datos);
    } catch (error) {
      console.error('Error en el análisis de la imagen:', error);
      alert('Error al analizar la imagen');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        ResuMatic
      </Typography>

      <div className="card-container">
        <Card>
          <CardHeader title="Subir Recibo" />
          <CardContent>
            <Box
              sx={{
                border: '2px dashed grey',
                borderRadius: 2,
                padding: 2,
                textAlign: 'center',
                cursor: 'pointer',
              }}
              onClick={() => document.getElementById('fileInput').click()}
            >
              {file ? (
                <Typography variant="body1" color="primary">
                  Archivo seleccionado: {file.name}
                </Typography>
              ) : (
                <>
                  <Typography variant="body1">Haga clic para subir o arrastre una imagen aquí</Typography>
                  <Typography variant="caption">
                    Formatos admitidos: JPEG, PNG, GIF, BMP, TIFF. Tamaño máximo: 4MB
                  </Typography>
                </>
              )}
              <input
                id="fileInput"
                type="file"
                hidden
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff"
              />
            </Box>
            <Button variant="contained" fullWidth sx={{ marginTop: 2 }} onClick={analyzeImage}>
              Analizar Imagen
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Resumen del Recibo" />
          <CardContent>
            {billData ? (
              <>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label="Todos" />
                  <Tab label="Consumo" />
                  <Tab label="Pago" />
                </Tabs>

                {tabValue === 0 && (
                  <Box sx={{ marginTop: 2 }}>
                    <Typography>Servicio: {billData.service}</Typography>
                    <Typography>Contrato: {billData.contractNumber}</Typography>
                    <Typography>Consumo actual: {billData.currentConsumption} kWh</Typography>
                    <Typography>Monto a pagar: ${billData.totalAmount}</Typography>
                    <Typography>Fecha de vencimiento: {billData.dueDate}</Typography>
                  </Box>
                )}
              </>
            ) : (
              <Typography>Sube un recibo para ver el resumen aquí.</Typography>
            )}
          </CardContent>
        </Card>
      </div>
    </Box>
  );
}
