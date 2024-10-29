// ResuMatic.jsx
import React, { useState } from 'react';
import { Box, Button, Typography, Tabs, Tab, Card, CardContent, CardHeader } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

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

  // Configuración de datos y opciones para el gráfico de barras
  const chartData = {
    labels: billData ? Object.keys(billData.consumptionData || {}) : [],
    datasets: [
      {
        label: 'Consumo Mensual',
        data: billData ? Object.values(billData.consumptionData || {}) : [],
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

                {tabValue === 1 && (
                  <Box sx={{ marginTop: 2 }}>
                    <Typography variant="h6">Consumo de los últimos meses:</Typography>
                    <Bar data={chartData} options={chartOptions} />
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
