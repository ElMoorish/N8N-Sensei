import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  PlayArrow as PlayIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Psychology as AIIcon,
  TrendingUp as OptimizeIcon,
} from '@mui/icons-material';

// Mock workflow data
const mockWorkflows = [
  {
    id: '1',
    name: 'Email Newsletter Automation',
    description: 'Automated email campaigns with subscriber management',
    status: 'active',
    nodes: 8,
    executions: 156,
    success_rate: 98.5,
    last_execution: '2 hours ago',
    category: 'Marketing'
  },
  {
    id: '2', 
    name: 'Slack Alert System',
    description: 'Monitor system health and send alerts to Slack',
    status: 'active',
    nodes: 5,
    executions: 89,
    success_rate: 100,
    last_execution: '15 minutes ago',
    category: 'Monitoring'
  },
  {
    id: '3',
    name: 'Data Backup Workflow',
    description: 'Daily backup of critical data to cloud storage',
    status: 'inactive',
    nodes: 12,
    executions: 45,
    success_rate: 95.6,
    last_execution: '1 day ago',
    category: 'Data Management'
  }
];

function WorkflowDojo() {
  const [workflows, setWorkflows] = useState(mockWorkflows);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('create'); // 'create', 'generate'
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('llama');

  const handleCreateWorkflow = () => {
    setDialogType('create');
    setOpenDialog(true);
  };

  const handleGenerateWorkflow = () => {
    setDialogType('generate');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setWorkflowDescription('');
  };

  const handleSubmit = () => {
    if (dialogType === 'generate') {
      // Mock AI workflow generation
      const newWorkflow = {
        id: Date.now().toString(),
        name: `AI Generated: ${workflowDescription.slice(0, 30)}...`,
        description: workflowDescription,
        status: 'inactive',
        nodes: Math.floor(Math.random() * 10) + 3,
        executions: 0,
        success_rate: 0,
        last_execution: 'Never',
        category: 'AI Generated'
      };
      setWorkflows(prev => [...prev, newWorkflow]);
    }
    handleCloseDialog();
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'default';
  };

  const getSuccessRateColor = (rate) => {
    if (rate >= 95) return 'success';
    if (rate >= 85) return 'warning';
    return 'error';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          🥋 Workflow Dojo
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleCreateWorkflow}
          >
            Create Workflow
          </Button>
          <Button
            variant="contained"
            startIcon={<AIIcon />}
            onClick={handleGenerateWorkflow}
          >
            Generate with AI
          </Button>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Workflows
              </Typography>
              <Typography variant="h4">
                {workflows.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Workflows
              </Typography>
              <Typography variant="h4">
                {workflows.filter(w => w.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Executions
              </Typography>
              <Typography variant="h4">
                {workflows.reduce((sum, w) => sum + w.executions, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg Success Rate
              </Typography>
              <Typography variant="h4">
                {(workflows.reduce((sum, w) => sum + w.success_rate, 0) / workflows.length).toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Workflows Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🎯 Your Workflows
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="center">Nodes</TableCell>
                  <TableCell align="center">Executions</TableCell>
                  <TableCell align="center">Success Rate</TableCell>
                  <TableCell>Last Execution</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workflows.map((workflow) => (
                  <TableRow key={workflow.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {workflow.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {workflow.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={workflow.status}
                        color={getStatusColor(workflow.status)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={workflow.category}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">{workflow.nodes}</TableCell>
                    <TableCell align="center">{workflow.executions}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${workflow.success_rate}%`}
                        color={getSuccessRateColor(workflow.success_rate)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{workflow.last_execution}</TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={1}>
                        <Tooltip title="View Workflow">
                          <IconButton size="small">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Execute">
                          <IconButton size="small" color="primary">
                            <PlayIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="AI Optimize">
                          <IconButton size="small" color="secondary">
                            <OptimizeIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create/Generate Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogType === 'create' ? '🔧 Create New Workflow' : '🤖 Generate Workflow with AI'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'generate' ? (
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>AI Provider</InputLabel>
                <Select
                  value={selectedProvider}
                  label="AI Provider"
                  onChange={(e) => setSelectedProvider(e.target.value)}
                >
                  <MenuItem value="llama">🦙 LLama (Local)</MenuItem>
                  <MenuItem value="lm_studio">🏠 LM Studio</MenuItem>
                  <MenuItem value="anthropic">🧠 Anthropic</MenuItem>
                  <MenuItem value="openai">🤖 OpenAI</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Describe your workflow"
                placeholder="Example: Create a workflow that monitors my website uptime, sends alerts to Slack when it's down, and logs incidents to a Google Sheet..."
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                helperText="Describe what you want your workflow to do. Be as specific as possible for better AI generation."
              />
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                This will open the N8N workflow editor where you can manually create your workflow.
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => window.open('http://localhost:5678', '_blank')}
              >
                Open N8N Editor
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={dialogType === 'generate' && !workflowDescription.trim()}
          >
            {dialogType === 'create' ? 'Open Editor' : 'Generate Workflow'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default WorkflowDojo;