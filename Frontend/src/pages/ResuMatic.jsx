import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Tabs, Tab, Card, CardContent, CardHeader, Divider, Grid } from '@mui/material';
import { UploadFile, Description, BarChart, Payment, InsertDriveFile } from '@mui/icons-material';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

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
      const response = await fetch('https://resumatic-mbix.onrender.com/extract-text', {
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
    {/* Contenedor para los Grids del lado izquierdo */}
    <Grid item xs={12} md={5}>
      {/* Card de Subir Recibo */}
      <Card sx={{ backgroundColor: '#e3f2fd', borderRadius: 3, boxShadow: 3, padding: 2, marginBottom: 4 }}>
        <CardHeader title="Subir Recibo" sx={{ color: '#1e88e5', textAlign: 'center' }} />
        <Divider />
        <CardContent sx={{ textAlign: 'center', position: 'relative' }}>
          <Box
            sx={{
              border: '2px dashed #90caf9',
              borderRadius: 2,
              padding: 3,
              cursor: 'pointer',
              wordWrap: 'break-word', // Permite que el texto se ajuste en varias líneas si es necesario
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

      {/* Card adicional debajo del primero */}
      <Card sx={{ backgroundColor: '#ffe0b2', borderRadius: 3, boxShadow: 3, padding: 2 }}>
        <CardHeader title="Información Principal" sx={{ color: '#ff9800', textAlign: 'center' }} />
        <Divider />
        <CardContent sx={{ textAlign: 'center' }}>
          {billData ? (  
          <Typography variant="body1" sx={{ color: '#ff9800' }}>
            <Typography variant="subtitle1">
              <Box component="span" sx={{ fontWeight: 'bold' }}>Contrato:</Box> {billData.contrato}
            </Typography>
            <Typography variant="subtitle1">
              <Box component="span" sx={{ fontWeight: 'bold' }}>Precio:</Box> {billData.precio}
            </Typography>
          </Typography> ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#757575', mt: 3 }}>
            <Typography variant="body1" sx={{ color: '#ff9800' }}>
              Aquí se presentara la informacion mas importante.
            </Typography>
          </Box>
          )}
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
                  </Tabs>

                  {tabValue === 0 && (
                    <Box sx={{ marginTop: 2, textAlign: 'left', color: '#2c3e50' }}>
                    <Typography variant="subtitle1">
                      <Box component="span" sx={{ fontWeight: 'bold' }}>Beneficiario:</Box> {billData.beneficiario}
                    </Typography>
                    <Typography variant="subtitle1">
                      <Box component="span" sx={{ fontWeight: 'bold' }}>Empresa:</Box> {billData.empresa}
                    </Typography>
                    <Typography variant="subtitle1">
                      <Box component="span" sx={{ fontWeight: 'bold' }}>Fecha de Pago:</Box> {billData.fechaPago}
                    </Typography>
                    <Typography variant="subtitle1">
                      <Box component="span" sx={{ fontWeight: 'bold' }}>Fecha de Suspensión:</Box> {billData.fechaSuspension}
                    </Typography>
                    <Typography variant="subtitle1">
                      <Box component="span" sx={{ fontWeight: 'bold' }}>Consumo Anterior:</Box> {billData.consumoAnterior} kWh
                    </Typography>
                    <Typography variant="subtitle1">
                      <Box component="span" sx={{ fontWeight: 'bold' }}>Consumo Actual:</Box> {billData.consumoActual} kWh
                    </Typography>
                    <Typography variant="subtitle1">
                      <Box component="span" sx={{ fontWeight: 'bold' }}>Consumo del Período:</Box> {billData.consumoPeriodo} kWh
                    </Typography>
                    <Typography variant="subtitle1">
                      <Box component="span" sx={{ fontWeight: 'bold' }}>Último Pago:</Box> {billData.fechaUltimoPago}
                    </Typography>
                    <Typography variant="subtitle1">
                      <Box component="span" sx={{ fontWeight: 'bold' }}>Valor del Último Pago:</Box> {billData.valorUltimoPago}
                    </Typography>
                  </Box>
                  )}

                  {tabValue === 1 && (
                    <Box sx={{ marginTop: 2, textAlign: 'center', color: '#2c3e50' }}>
                      <Typography variant="h6">Gráfico de Consumo</Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <ReBarChart data={billData.record} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="consumo" fill="#8884d8" />
                        </ReBarChart>
                      </ResponsiveContainer>
                    </Box>
                  )}
                  
                  {}

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
