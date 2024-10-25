import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Tabs, Tab, Card, CardContent, CardHeader } from '@mui/material';

export default function ResuMatic() {
  const [file, setFile] = useState(null);
  const [billData, setBillData] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const analyzeImage = () => {
    setBillData({
      service: 'Electricidad',
      contractNumber: '123456789',
      currentConsumption: 150,
      totalAmount: 75000,
      dueDate: '2023-06-30',
    });
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
              <Typography variant="body1">Haga clic para subir o arrastre una imagen aquí</Typography>
              <Typography variant="caption">
                Formatos admitidos: JPEG, PNG, GIF, BMP, TIFF. Tamaño máximo: 4MB
              </Typography>
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
            <TextField fullWidth label="Número de contrato" variant="outlined" sx={{ marginTop: 2 }} />
            <TextField fullWidth label="Monto a pagar" variant="outlined" sx={{ marginTop: 2 }} />
          </CardContent>
        </Card>

        {/* Card de resumen del recibo */}
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

                {tabValue === 1 && (
                  <Box sx={{ marginTop: 2 }}>
                    <Typography>Gráfico de consumo de los últimos meses (aquí iría un gráfico)</Typography>
                  </Box>
                )}

                {tabValue === 2 && (
                  <Box sx={{ marginTop: 2 }}>
                    <Typography>Monto a pagar: ${billData.totalAmount}</Typography>
                    <Typography>Fecha de vencimiento: {billData.dueDate}</Typography>
                    <Button variant="contained" color="success" sx={{ marginTop: 2 }}>
                      Ir a la página de pago
                    </Button>
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
