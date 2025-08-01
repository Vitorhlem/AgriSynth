// Vitor h. Lemes

import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container, Typography, Box, CircularProgress, Alert, Paper, Breadcrumbs, Link, Chip,
  Button, Divider, Grid, FormControl, InputLabel, Select, MenuItem, Card, CardContent, CardHeader
} from '@mui/material'; // <-- NOVAS IMPORTAÇÕES
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PublicIcon from '@mui/icons-material/Public';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // <-- NOVA IMPORTAÇÃO
import apiClient from '../services/api';
import AnalysisHistory from '../components/AnalysisHistory';

// ... (interface Project e estados existentes) ...

const ProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  // ... (todos os estados existentes para Projeto, PDF e Imagem) ...
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // --- NOVOS ESTADOS PARA O SINTETIZADOR DE CENÁRIOS ---
  const [synthesisGoal, setSynthesisGoal] = useState('maximize_profit');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisError, setSynthesisError] = useState<string | null>(null);
  const [synthesisResults, setSynthesisResults] = useState<any[] | null>(null);
  // --- FIM DOS NOVOS ESTADOS ---


  useEffect(() => { /* ... (lógica de fetch do projeto) ... */ }, [projectId]);

  // ... (todos os handlers de upload existentes) ...

  // --- NOVA FUNÇÃO HANDLER PARA GERAR CENÁRIOS ---
  const handleSynthesize = async () => {
    if (!projectId) return;
    setIsSynthesizing(true);
    setSynthesisError(null);
    setSynthesisResults(null);

    const requestBody = {
      goals: {
        primary: synthesisGoal,
        // Em uma versão real, teríamos mais inputs do usuário aqui
      },
      plot_data: {
        // Em uma versão real, buscaríamos estes dados do nosso DB
        soil_ph: 6.2,
        organic_matter_percent: 3.8,
        region: project?.location || 'Não especificada'
      }
    };

    try {
      const response = await apiClient.post(`/api/v1/scenarios/${projectId}`, requestBody);
      setSynthesisResults(response.data.scenarios);
    } catch (err) {
      setSynthesisError("Falha ao gerar os cenários. O serviço de IA pode estar sobrecarregado.");
      console.error(err);
    } finally {
      setIsSynthesizing(false);
    }
  };
  // --- FIM DA NOVA FUNÇÃO ---


  if (loading) return <Container sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Container>;
  
  return (
    <Container maxWidth="lg">
      {/* ... (Cabeçalho, Gêmeo Digital, Seção de Análises de IA existentes) ... */}
      
      <Divider sx={{ my: 4 }} />

      {/* --- NOVA SEÇÃO DO SINTETIZADOR DE CENÁRIOS --- */}
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>Sintetizador de Cenários</Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography sx={{ mb: 2 }}>
          Defina seu principal objetivo e deixe a IA Generativa criar e simular diferentes estratégias de cultivo para o seu talhão.
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="goal-select-label">Objetivo Principal</InputLabel>
          <Select
            labelId="goal-select-label"
            value={synthesisGoal}
            label="Objetivo Principal"
            onChange={(e) => setSynthesisGoal(e.target.value)}
          >
            <MenuItem value="maximize_profit">Maximizar Lucro</MenuItem>
            <MenuItem value="maximize_yield">Maximizar Produtividade (sacas/ha)</MenuItem>
            <MenuItem value="improve_soil_health">Melhorar Saúde do Solo</MenuItem>
            <MenuItem value="minimize_water_usage">Minimizar Uso de Água</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AutoAwesomeIcon />}
          onClick={handleSynthesize}
          disabled={isSynthesizing}
        >
          {isSynthesizing ? <CircularProgress size={24} color="inherit" /> : 'Gerar Cenários com IA'}
        </Button>

        {synthesisError && <Alert severity="error" sx={{ mt: 2 }}>{synthesisError}</Alert>}
        
        {synthesisResults && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Cenários Sugeridos:</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {synthesisResults.map((scenario, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ height: '100%' }}>
                    <CardHeader title={scenario.scenario_name} subheader={`Produtividade Estimada: ${scenario.simulation_results.predicted_yield_sacks_ha} sacas/ha`}/>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">{scenario.justification}</Typography>
                      <Box sx={{mt: 2}}>
                        <Typography variant="body2" fontWeight="bold">Plano de Cultivo:</Typography>
                        <Typography variant="caption" component="div">Cultura: {scenario.cultivation_plan.crop}</Typography>
                        <Typography variant="caption" component="div">Variedade: {scenario.cultivation_plan.variety}</Typography>
                        <Typography variant="caption" component="div">Densidade: {scenario.cultivation_plan.density_seeds_ha} sementes/ha</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>
      {/* --- FIM DA NOVA SEÇÃO --- */}
    </Container>
  );
};

export default ProjectPage;