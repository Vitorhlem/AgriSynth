// Vitor h. Lemes

import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importando a nova página
import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';
import CreateProjectPage from './pages/CreateProjectPage'; // <-- NOVA IMPORTAÇÃO

// Define um tema básico para a aplicação (dark mode)
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    }
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
              {/* Rota principal da aplicação */}
              <Route path="/" element={<HomePage />} />

              {/* A nova rota para a página de criação.
                  É importante que ela venha ANTES da rota com o :projectId,
                  para que o roteador não confunda "new" com um ID de projeto. */}
              <Route path="/project/new" element={<CreateProjectPage />} /> {/* <-- NOVA ROTA */}

              {/* Rota para a página de um projeto específico */}
              <Route path="/project/:projectId" element={<ProjectPage />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;