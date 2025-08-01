// Vitor h. Lemes

import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../components/MapComponent';
import apiClient from '../services/api';
import { FeatureCollection } from 'geojson';

const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [geometry, setGeometry] = useState<FeatureCollection | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Callback que será passada para o MapComponent
  const handleDrawComplete = (geoJson: FeatureCollection) => {
    setGeometry(geoJson);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !location || !geometry || geometry.features.length === 0) {
      setError("Por favor, preencha todos os campos e desenhe a área do talhão no mapa.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = {
      name: name,
      location: location,
      // O backend espera o GeoJSON da geometria como uma string
      geom: JSON.stringify(geometry.features[0].geometry),
      // O UserID será adicionado no futuro com a autenticação
      user_id: 'user_placeholder'
    };

    try {
      const response = await apiClient.post('/api/v1/projects', payload);
      setSuccess(`Projeto "${response.data.name}" criado com sucesso! Redirecionando...`);
      // Redireciona para a página do projeto recém-criado após um breve delay
      setTimeout(() => {
        navigate(`/project/${response.data.id}`);
      }, 2000);
    } catch (err) {
      setError("Falha ao criar o projeto. Tente novamente.");
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Criar Novo Projeto AgriSynth
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Preencha os detalhes abaixo e desenhe os limites do seu talhão no mapa para criar um novo Gêmeo Digital.
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome do Projeto"
            variant="outlined"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Localização (Ex: Cidade - UF)"
            variant="outlined"
            fullWidth
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <Typography variant="h6" gutterBottom>Área do Talhão</Typography>
          <MapComponent onDrawComplete={handleDrawComplete} />

          <Box sx={{ mt: 3, position: 'relative' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isSubmitting || !geometry || geometry.features.length === 0}
            >
              Criar Projeto
            </Button>
            {isSubmitting && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
        </form>
        
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      </Paper>
    </Container>
  );
};

export default CreateProjectPage;