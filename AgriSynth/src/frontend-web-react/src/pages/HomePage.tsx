// Vitor h. Lemes

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LandscapeIcon from '@mui/icons-material/Landscape';
import { Link } from 'react-router-dom';
import apiClient from '../services/api'; // <-- NOVA IMPORTAÇÃO

// A interface 'Project' precisa corresponder exatamente à struct do Go.
interface Project {
  id: string;
  name: string;
  location: string;
  created_at: string; // O Go serializa time.Time como string ISO 8601
  updated_at: string;
}

const HomePage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // O hook useEffect agora buscará os dados reais da API.
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // --- LÓGICA DE API REAL ---
        // Substituímos o setTimeout pela chamada ao nosso apiClient.
        // O <Project[]> diz ao TypeScript o formato esperado da resposta.
        const response = await apiClient.get<Project[]>('/api/v1/projects');
        setProjects(response.data);
        // --- FIM DA LÓGICA DE API ---

      } catch (err) {
        setError('Falha ao carregar os projetos. O backend está rodando?');
        console.error(err);
      } finally {
        // O finally garante que o loading pare, com ou sem erro.
        setLoading(false);
      }
    };

    fetchProjects();
  }, []); // O array vazio [] garante que o useEffect rode apenas uma vez

  // O resto do código JSX para renderização permanece o mesmo.
  // Ele já está preparado para lidar com os estados de loading, error e lista de projetos.
  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Meus Projetos AgriSynth
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          component={Link}
          to="/project/new" 
        >
          Criar Novo Projeto
        </Button>
      </Box>

      <Paper elevation={3}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && (
          <List>
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <ListItem key={project.id} disablePadding>
                  <ListItemButton component={Link} to={`/project/${project.id}`}>
                    <ListItemIcon>
                      <LandscapeIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={project.name}
                      secondary={project.location}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <Typography sx={{ p: 3, textAlign: 'center' }}>
                Nenhum projeto encontrado.
              </Typography>
            )}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default HomePage;