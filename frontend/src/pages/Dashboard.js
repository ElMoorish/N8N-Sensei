import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Button,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as AIIcon,
  AccountTree as WorkflowIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// Mock data for demonstration
const mockWorkflowData = [
  { name: 'Email Automation', executions: 45, success: 42, failed: 3 },
  { name: 'Data Sync', executions: 32, success: 30, failed: 2 },
  { name: 'Report Generator', executions: 28, success: 25, failed: 3 },
  { name: 'Slack Notifications', executions: 67, success: 65, failed: 2 },
];

const mockPerformanceData = [
  { time: '00:00', executions: 12 },
  { time: '04:00', executions: 8 },
  { time: '08:00', executions: 25 },
  { time: '12:00', executions: 35 },
  { time: '16:00', executions: 42 },
  { time: '20:00', executions: 28 },
];

function Dashboard() {
  // Mock API calls - replace with actual API calls
  const { data: healthData, isLoading: healthLoading } = useQuery('health', () => 
    Promise.resolve({
      status: 'healthy',
      n8n_connected: true,
      ai_providers: {
        llama: true,
        openai: false,
        anthropic: true,
        lm_studio: true,
        ollama: false,
        openrouter: false
      },
      database_connected: true
    })
  );

  const { data: workflowStats } = useQuery('workflow-stats', () =>
    Promise.resolve({
      total_workflows: 12,
      active_workflows: 8,
      total_executions_today: 156,
      success_rate: 94.2
    })
  );

  const aiProviders = healthData?.ai_providers || {};
  const connectedProviders = Object.entries(aiProviders).filter(([_, connected]) => connected);

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        🥋 Sensei Dashboard
      </Typography>
      
      {/* Status Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    System Status
                  </Typography>
                  <Typography variant="h5">
                    {healthData?.status === 'healthy' ? '🟢 Healthy' : '🔴 Issues'}
                  </Typography>
                </Box>
                <SpeedIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Workflows
                  </Typography>
                  <Typography variant="h5">
                    {workflowStats?.active_workflows || 0}
                  </Typography>
                </Box>
                <WorkflowIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    AI Providers
                  </Typography>
                  <Typography variant="h5">
                    {connectedProviders.length}/6
                  </Typography>
                </Box>
                <AIIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Success Rate
                  </Typography>
                  <Typography variant="h5">
                    {workflowStats?.success_rate || 0}%
                  </Typography>
                </Box>
                <TrendingUpIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* AI Providers Status */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🤖 AI Providers Status
              </Typography>
              <Box sx={{ mt: 2 }}>
                {Object.entries(aiProviders).map(([provider, connected]) => (
                  <Box key={provider} display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                      {provider === 'lm_studio' ? 'LM Studio' : provider}
                    </Typography>
                    <Chip 
                      label={connected ? 'Connected' : 'Disconnected'} 
                      color={connected ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                ))}
              </Box>
              <Button 
                variant="outlined" 
                startIcon={<RefreshIcon />} 
                sx={{ mt: 2 }}
                fullWidth
              >
                Refresh Status
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎯 Quick Actions
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="contained" 
                  startIcon={<AIIcon />} 
                  fullWidth 
                  sx={{ mb: 2 }}
                >
                  Chat with AI Sensei
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<WorkflowIcon />} 
                  fullWidth 
                  sx={{ mb: 2 }}
                >
                  Create New Workflow
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<PlayIcon />} 
                  fullWidth
                >
                  Execute Workflow
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Workflow Performance (24h)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="executions" stroke="#ff6d00" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🏆 Top Workflows
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockWorkflowData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="executions" fill="#ff6d00" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;