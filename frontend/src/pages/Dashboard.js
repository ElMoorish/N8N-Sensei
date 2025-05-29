import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  alpha,
  useTheme,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as AIIcon,
  AccountTree as WorkflowIcon,
  Speed as SpeedIcon,
  Chat as ChatIcon,
  Add as AddIcon,
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
  const theme = useTheme();
  const navigate = useNavigate();
  
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

  // Apple-inspired card style
  const cardStyle = {
    borderRadius: '16px',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    background: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(20px)',
    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.12)}`,
    },
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          🥋 Sensei Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
          Monitor your AI workflow automation in real-time
        </Typography>
      </Box>
      
      {/* Status Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    System Status
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: healthData?.status === 'healthy' ? 'success.main' : 'error.main' }}>
                    {healthData?.status === 'healthy' ? 'Healthy' : 'Issues'}
                  </Typography>
                </Box>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: '12px', 
                  background: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main'
                }}>
                  <SpeedIcon sx={{ fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    Active Workflows
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {workflowStats?.active_workflows || 0}
                  </Typography>
                </Box>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: '12px', 
                  background: alpha(theme.palette.secondary.main, 0.1),
                  color: 'secondary.main'
                }}>
                  <WorkflowIcon sx={{ fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    AI Providers
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {connectedProviders.length}/6
                  </Typography>
                </Box>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: '12px', 
                  background: alpha(theme.palette.info.main, 0.1),
                  color: 'info.main'
                }}>
                  <AIIcon sx={{ fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    Success Rate
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {workflowStats?.success_rate || 0}%
                  </Typography>
                </Box>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: '12px', 
                  background: alpha(theme.palette.success.main, 0.1),
                  color: 'success.main'
                }}>
                  <TrendingUpIcon sx={{ fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* AI Providers Status */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                🤖 AI Providers Status
              </Typography>
              <Box sx={{ mt: 2 }}>
                {Object.entries(aiProviders).map(([provider, connected]) => (
                  <Box key={provider} display="flex" alignItems="center" justifyContent="space-between" sx={{ 
                    mb: 2, 
                    p: 2, 
                    borderRadius: '12px',
                    background: alpha(theme.palette.background.default, 0.5),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}>
                    <Typography variant="body1" sx={{ textTransform: 'capitalize', fontWeight: 500 }}>
                      {provider === 'lm_studio' ? 'LM Studio' : provider}
                    </Typography>
                    <Chip 
                      label={connected ? 'Connected' : 'Disconnected'} 
                      color={connected ? 'success' : 'error'}
                      size="small"
                      sx={{ 
                        fontWeight: 600,
                        borderRadius: '8px',
                      }}
                    />
                  </Box>
                ))}
              </Box>
              <Button 
                variant="outlined" 
                startIcon={<RefreshIcon />} 
                sx={{ 
                  mt: 2,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
                fullWidth
              >
                Refresh Status
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                🎯 Quick Actions
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="contained" 
                  startIcon={<ChatIcon />} 
                  fullWidth 
                  onClick={() => navigate('/ai-chat')}
                  sx={{ 
                    mb: 2,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    }
                  }}
                >
                  Chat with AI Sensei
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />} 
                  fullWidth 
                  onClick={() => navigate('/workflow-dojo')}
                  sx={{ 
                    mb: 2,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.5,
                  }}
                >
                  Create New Workflow
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<PlayIcon />} 
                  fullWidth
                  onClick={() => navigate('/workflow-dojo')}
                  sx={{ 
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.5,
                  }}
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
          <Card sx={cardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                📊 Workflow Performance (24h)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.2)} />
                  <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: alpha(theme.palette.background.paper, 0.95),
                      border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                      borderRadius: '12px',
                      backdropFilter: 'blur(20px)',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="executions" 
                    stroke="url(#colorGradient)" 
                    strokeWidth={3}
                    dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: theme.palette.primary.main, strokeWidth: 2 }}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#667eea" />
                      <stop offset="100%" stopColor="#764ba2" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={cardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                🏆 Top Workflows
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockWorkflowData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.2)} />
                  <XAxis type="number" stroke={theme.palette.text.secondary} />
                  <YAxis dataKey="name" type="category" width={80} stroke={theme.palette.text.secondary} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: alpha(theme.palette.background.paper, 0.95),
                      border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                      borderRadius: '12px',
                      backdropFilter: 'blur(20px)',
                    }}
                  />
                  <Bar dataKey="executions" fill="url(#barGradient)" radius={[0, 4, 4, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#667eea" />
                      <stop offset="100%" stopColor="#764ba2" />
                    </linearGradient>
                  </defs>
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