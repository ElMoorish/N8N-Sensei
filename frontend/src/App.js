import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from 'react-query';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import WorkflowDojo from './pages/WorkflowDojo';
import AIChat from './pages/AIChat';
import TrainingHub from './pages/TrainingHub';
import Settings from './pages/Settings';

// Create a custom theme for N8N-Sensei
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff6d00', // Orange for the sensei theme
    },
    secondary: {
      main: '#00bcd4', // Cyan for accents
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
        },
      },
    },
  },
});

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/workflow-dojo" element={<WorkflowDojo />} />
              <Route path="/ai-chat" element={<AIChat />} />
              <Route path="/training-hub" element={<TrainingHub />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;