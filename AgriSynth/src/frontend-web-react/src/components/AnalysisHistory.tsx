// Vitor h. Lemes

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import apiClient from '../services/api';
import AnalysisResultViewer from './AnalysisResultViewer'; // <-- NOVA IMPORTAÇÃO

interface AnalysisRecord {
  id: string;
  created_at: string;
  analysis_source: string;
  result_data: any;
}

interface AnalysisHistoryProps {
  projectId: string;
  analysisType: 'soil' | 'image';
  title: string;
}

const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ projectId, analysisType, title }) => {
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      const endpoint = `/api/v1/projects/${projectId}/${analysisType}-analyses`;
      try {
        const response = await apiClient.get<AnalysisRecord[]>(endpoint);
        setHistory(response.data);
      } catch (err) {
        setError(`Falha ao carregar o histórico de análises de ${analysisType}.`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [projectId, analysisType]);

  const handleToggle = (itemId: string) => {
    setOpenItemId(openItemId === itemId ? null : itemId);
  };

  if (loading) return <CircularProgress size={24} sx={{display: 'block', margin: 'auto'}} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
      {history.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Nenhum histórico encontrado.
        </Typography>
      ) : (
        <List dense>
          {history.map((record) => (
            <React.Fragment key={record.id}>
              <ListItem>
                <ListItemText
                  primary={`Análise de ${new Date(record.created_at).toLocaleString('pt-BR')}`}
                  secondary={record.analysis_source}
                />
                <IconButton edge="end" onClick={() => handleToggle(record.id)}>
                  {openItemId === record.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </ListItem>
              <Collapse in={openItemId === record.id} timeout="auto" unmountOnExit>
                {/* --- SUBSTITUIÇÃO DA LÓGICA DE EXIBIÇÃO --- */}
                <Box sx={{ pl: 4, pb: 2 }}>
                  <AnalysisResultViewer
                    result={record.result_data}
                    analysisType={analysisType}
                  />
                </Box>
                {/* --- FIM DA SUBSTITUIÇÃO --- */}
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default AnalysisHistory;