import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Tabs, Tab, Card, CardContent, CardHeader, Divider, Grid } from '@mui/material';
import { UploadFile, Description, BarChart, Payment, InsertDriveFile } from '@mui/icons-material';

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
      const response = await fetch('http://localhost:3000/extract-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.mensaje || 'Error desconocido');
        return;
      }

      const data = await response.json();
      console.log("Datos recibidos del backend:", data);
      setBillData(data);
    } catch (error) {
      console.error('Error en el análisis de la imagen:', error);
      alert('Error al analizar la imagen');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    console.log("Actualización de billData:", billData);
  }, [billData]);

  // Configuración de datos y opciones para el gráfico de barras
  const chartData = {
    labels: billData ? Object.keys(billData.consumptionData || {}) : [],
    datasets: [
      {
        label: 'Consumo Mensual',
        data: billData ? Object.values(billData.consumoActual || {}) : [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (context) => `Consumo: ${context.raw} kWh`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Consumo (kWh)' },
      },
    },
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f4f6f8', minHeight: '100vh', textAlign: 'center' }}>
      {/* Título centrado con icono y descripción */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Description fontSize="large" color="primary" />
        <Typography variant="h4" sx={{ color: '#2c3e50', fontWeight: 'bold', mt: 1 }}>
          ResuMatic
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {/* Card de Subir Recibo */}
        <Grid item xs={12} md={5}>
          <Card sx={{ backgroundColor: '#e3f2fd', borderRadius: 3, boxShadow: 3, padding: 2 }}>
            <CardHeader title="Subir Recibo" sx={{ color: '#1e88e5', textAlign: 'center' }} />
            <Divider />
            <CardContent sx={{ textAlign: 'center', position: 'relative' }}>
              <Box
                sx={{
                  border: '2px dashed #90caf9',
                  borderRadius: 2,
                  padding: 3,
                  cursor: 'pointer',
                  wordWrap: 'break-word',  // Permite que el texto se ajuste en varias líneas si es necesario
                  '&:hover': { backgroundColor: '#e3f2fd' },
                }}
                onClick={() => document.getElementById('fileInput').click()}
              >
                {file ? (
                  <Typography
                    variant="body1"
                    color="primary"
                    sx={{
                      display: 'inline-block',
                      textAlign: 'center',
                    }}
                  >
                    Archivo seleccionado: {file.name}
                  </Typography>
                ) : (
                  <>
                    <UploadFile fontSize="large" sx={{ color: '#1e88e5', marginBottom: 1 }} />
                    <Typography variant="body1">Haga clic para subir o arrastre una imagen aquí</Typography>
                    <Typography variant="caption" display="block" sx={{ color: '#5c6bc0' }}>
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
              <Button
                variant="contained"
                fullWidth
                sx={{
                  marginTop: 2,
                  backgroundColor: '#1e88e5',
                  color: '#fff',
                  fontWeight: 'bold',
                  '&:hover': { backgroundColor: '#1565c0' },
                }}
                onClick={analyzeImage}
              >
                Analizar Imagen
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Card de Resumen del Recibo */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, padding: 2 }}>
            <CardHeader title="Resumen del Recibo" sx={{ color: '#3949ab', textAlign: 'center' }} />
            <Divider />
            <CardContent>
              {billData ? (
                <>
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    textColor="primary"
                    indicatorColor="primary"
                    centered
                    sx={{ marginBottom: 2 }}
                  >
                    <Tab icon={<Description />} label="Todos" />
                    <Tab icon={<BarChart />} label="Consumo" />
                    <Tab icon={<Payment />} label="Pago" />
                  </Tabs>

                  {tabValue === 0 && (
                    <Box sx={{ marginTop: 2, textAlign: 'left', color: '#2c3e50' }}>
                      <Typography variant="subtitle1">Tipo: {billData.tipo}</Typography>
                      <Typography variant="subtitle1">Contrato: {billData.contrato}</Typography>
                      <Typography variant="subtitle1">Precio: {billData.precio}</Typography>
                      <Typography variant="subtitle1">Beneficiario: {billData.beneficiario}</Typography>
                      <Typography variant="subtitle1">Empresa: {billData.empresa}</Typography>
                      <Typography variant="subtitle1">Fecha de Pago: {billData.fechaPago}</Typography>
                      <Typography variant="subtitle1">Fecha de Suspensión: {billData.fechaSuspension}</Typography>
                      <Typography variant="subtitle1">Consumo Anterior: {billData.consumoAnterior} kWh</Typography>
                      <Typography variant="subtitle1">Consumo Actual: {billData.consumoActual} kWh</Typography>
                      <Typography variant="subtitle1">Consumo del Período: {billData.consumoPeriodo} kWh</Typography>
                      <Typography variant="subtitle1">Último Pago: {billData.fechaUltimoPago}</Typography>
                      <Typography variant="subtitle1">Valor del Último Pago: {billData.valorUltimoPago}</Typography>
                      <Typography variant="subtitle1">Registro: {JSON.stringify(billData.record)}</Typography>
                    </Box>
                  )}
                </>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#757575', mt: 3 }}>
                  <InsertDriveFile fontSize="large" sx={{ fontSize: 60, color: '#cfd8dc' }} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Sube un recibo para ver el resumen aquí.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
