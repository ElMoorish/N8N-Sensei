import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from 'react-query';

import theme from './theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import WorkflowDojo from './pages/WorkflowDojo';
import AIChat from './pages/AIChat';
import TrainingHub from './pages/TrainingHub';
import Settings from './pages/Settings';

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