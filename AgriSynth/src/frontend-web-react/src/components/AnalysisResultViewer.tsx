// Vitor h. Lemes

import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Chip
} from '@mui/material';

// Mapeamento de chaves técnicas para nomes legíveis
const soilMetricLabels: { [key: string]: string } = {
  ph_h2o: "pH em Água (H₂O)",
  phosphorus_ppm: "Fósforo (P) em ppm",
  potassium_ppm: "Potássio (K) em ppm",
  organic_matter_percent: "Matéria Orgânica (%)",
  potential_acidity_h_al: "Acidez Potencial (H+Al)"
};

const imageMetricLabels: { [key: string]: string } = {
  vegetation_coverage_percent: "Cobertura Vegetal (%)",
  total_detected_objects: "Total de Objetos Detectados",
};

interface AnalysisResultViewerProps {
  result: any;
  analysisType: 'soil' | 'image';
}

const AnalysisResultViewer: React.FC<AnalysisResultViewerProps> = ({ result, analysisType }) => {
  // --- Renderização para Análise de Solo ---
  if (analysisType === 'soil') {
    return (
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableBody>
            {Object.entries(result).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell component="th" scope="row">
                  <Typography variant="body2" fontWeight="bold">
                    {soilMetricLabels[key] || key}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Chip label={String(value)} color="primary" variant="outlined" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  // --- Renderização para Análise de Imagem ---
  if (analysisType === 'image') {
    // Para a imagem, podemos fazer algo mais visual no futuro (gráficos, etc.)
    // Por enquanto, usaremos a mesma abordagem de tabela.
    const displayData = {
      vegetation_coverage_percent: result.vegetation_coverage_percent,
      total_detected_objects: result.total_detected_objects
    }
    return (
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableBody>
            {Object.entries(displayData).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell component="th" scope="row">
                  <Typography variant="body2" fontWeight="bold">
                    {imageMetricLabels[key] || key}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Chip label={String(value)} color="secondary" variant="outlined" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  // Fallback caso o tipo de análise não seja reconhecido
  return <Typography variant="body2">Formato de visualização não disponível.</Typography>;
};

export default AnalysisResultViewer;