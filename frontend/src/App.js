import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from 'react-query';

import theme from './theme';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import WorkflowDojo from './pages/WorkflowDojo';
import AIChat from './pages/AIChat';
import TrainingHub from './pages/TrainingHub';
import Settings from './pages/Settings';
import ProfileSettings from './pages/ProfileSettings';
import Preferences from './pages/Preferences';

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
          <Routes>
            {/* Landing page without layout */}
            <Route path="/landing" element={<LandingPage />} />
            
            {/* App pages with layout */}
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/workflow-dojo" element={<WorkflowDojo />} />
                  <Route path="/ai-chat" element={<AIChat />} />
                  <Route path="/training-hub" element={<TrainingHub />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile-settings" element={<ProfileSettings />} />
                  <Route path="/preferences" element={<Preferences />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;