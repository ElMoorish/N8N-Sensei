import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Alert,
  Tab,
  Tabs,
  Paper,
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  Psychology as AIIcon,
  AccountTree as WorkflowIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Settings() {
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState({
    // N8N Settings
    n8nHost: 'localhost',
    n8nPort: '5678',
    n8nApiKey: '',
    
    // AI Provider Settings
    llamaHost: 'localhost',
    llamaPort: '11434',
    lmStudioHost: 'localhost',
    lmStudioPort: '1234',
    ollamaHost: 'localhost',
    ollamaPort: '11434',
    openaiApiKey: '',
    anthropicApiKey: '',
    openrouterApiKey: '',
    
    // General Settings
    autoSave: true,
    notifications: true,
    darkMode: true,
    aiAssistance: true,
    
    // Advanced Settings
    maxRetries: 3,
    timeout: 30,
    logLevel: 'info'
  });

  const [connectionStatus, setConnectionStatus] = useState({
    n8n: true,
    llama: true,
    lmStudio: false,
    ollama: false,
    openai: false,
    anthropic: true,
    openrouter: false
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // Mock save operation
    console.log('Saving settings:', settings);
    // In real implementation, this would call the API
  };

  const handleTestConnection = async (service) => {
    // Mock connection test
    setConnectionStatus(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const getConnectionChip = (service, connected) => (
    <Chip
      label={connected ? 'Connected' : 'Disconnected'}
      color={connected ? 'success' : 'error'}
      size="small"
      onClick={() => handleTestConnection(service)}
      sx={{ cursor: 'pointer' }}
    />
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        ⚙️ Settings - Configure Your Sensei
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="settings tabs">
          <Tab icon={<WorkflowIcon />} label="N8N Connection" />
          <Tab icon={<AIIcon />} label="AI Providers" />
          <Tab icon={<NotificationsIcon />} label="General" />
          <Tab icon={<SecurityIcon />} label="Advanced" />
        </Tabs>

        {/* N8N Connection Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Configure your N8N instance connection. Make sure N8N is running and accessible.
              </Alert>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🔗 N8N Instance
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="body2">Connection Status:</Typography>
                    {getConnectionChip('n8n', connectionStatus.n8n)}
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="Host"
                    value={settings.n8nHost}
                    onChange={(e) => handleSettingChange('n8nHost', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Port"
                    value={settings.n8nPort}
                    onChange={(e) => handleSettingChange('n8nPort', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="API Key (Optional)"
                    type="password"
                    value={settings.n8nApiKey}
                    onChange={(e) => handleSettingChange('n8nApiKey', e.target.value)}
                    helperText="Required if N8N has authentication enabled"
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={() => handleTestConnection('n8n')}
                    fullWidth
                  >
                    Test Connection
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📊 Connection Info
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Current N8N URL: http://{settings.n8nHost}:{settings.n8nPort}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Quick Actions:
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => window.open(`http://${settings.n8nHost}:${settings.n8nPort}`, '_blank')}
                    sx={{ mr: 1, mb: 1 }}
                  >
                    Open N8N
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                  >
                    View Logs
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* AI Providers Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Configure your AI providers. Local AI providers (LLama, LM Studio, Ollama) run on your machine, 
                while cloud providers require API keys.
              </Alert>
            </Grid>

            {/* Local AI Providers */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🏠 Local AI Providers
                  </Typography>
                  
                  {/* LLama */}
                  <Box sx={{ mb: 3 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">🦙 LLama</Typography>
                      {getConnectionChip('llama', connectionStatus.llama)}
                    </Box>
                    <TextField
                      size="small"
                      label="Host"
                      value={settings.llamaHost}
                      onChange={(e) => handleSettingChange('llamaHost', e.target.value)}
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <TextField
                      size="small"
                      label="Port"
                      value={settings.llamaPort}
                      onChange={(e) => handleSettingChange('llamaPort', e.target.value)}
                      sx={{ mb: 1 }}
                    />
                  </Box>

                  {/* LM Studio */}
                  <Box sx={{ mb: 3 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">🏠 LM Studio</Typography>
                      {getConnectionChip('lmStudio', connectionStatus.lmStudio)}
                    </Box>
                    <TextField
                      size="small"
                      label="Host"
                      value={settings.lmStudioHost}
                      onChange={(e) => handleSettingChange('lmStudioHost', e.target.value)}
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <TextField
                      size="small"
                      label="Port"
                      value={settings.lmStudioPort}
                      onChange={(e) => handleSettingChange('lmStudioPort', e.target.value)}
                      sx={{ mb: 1 }}
                    />
                  </Box>

                  {/* Ollama */}
                  <Box>
                    <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">🔮 Ollama</Typography>
                      {getConnectionChip('ollama', connectionStatus.ollama)}
                    </Box>
                    <TextField
                      size="small"
                      label="Host"
                      value={settings.ollamaHost}
                      onChange={(e) => handleSettingChange('ollamaHost', e.target.value)}
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <TextField
                      size="small"
                      label="Port"
                      value={settings.ollamaPort}
                      onChange={(e) => handleSettingChange('ollamaPort', e.target.value)}
                      sx={{ mb: 1 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Cloud AI Providers */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    ☁️ Cloud AI Providers
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">🤖 OpenAI</Typography>
                      {getConnectionChip('openai', connectionStatus.openai)}
                    </Box>
                    <TextField
                      fullWidth
                      size="small"
                      label="API Key"
                      type="password"
                      value={settings.openaiApiKey}
                      onChange={(e) => handleSettingChange('openaiApiKey', e.target.value)}
                      sx={{ mb: 1 }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">🧠 Anthropic</Typography>
                      {getConnectionChip('anthropic', connectionStatus.anthropic)}
                    </Box>
                    <TextField
                      fullWidth
                      size="small"
                      label="API Key"
                      type="password"
                      value={settings.anthropicApiKey}
                      onChange={(e) => handleSettingChange('anthropicApiKey', e.target.value)}
                      sx={{ mb: 1 }}
                    />
                  </Box>

                  <Box>
                    <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">🌐 OpenRouter</Typography>
                      {getConnectionChip('openrouter', connectionStatus.openrouter)}
                    </Box>
                    <TextField
                      fullWidth
                      size="small"
                      label="API Key"
                      type="password"
                      value={settings.openrouterApiKey}
                      onChange={(e) => handleSettingChange('openrouterApiKey', e.target.value)}
                      sx={{ mb: 1 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* General Settings Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🎛️ General Preferences
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoSave}
                        onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                      />
                    }
                    label="Auto-save workflows"
                    sx={{ mb: 2, display: 'block' }}
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications}
                        onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                      />
                    }
                    label="Enable notifications"
                    sx={{ mb: 2, display: 'block' }}
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.darkMode}
                        onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                      />
                    }
                    label="Dark mode"
                    sx={{ mb: 2, display: 'block' }}
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.aiAssistance}
                        onChange={(e) => handleSettingChange('aiAssistance', e.target.checked)}
                      />
                    }
                    label="AI assistance suggestions"
                    sx={{ display: 'block' }}
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📱 Notification Settings
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Configure when and how you receive notifications from N8N-Sensei.
                  </Typography>
                  
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Workflow execution alerts"
                    sx={{ mb: 1, display: 'block' }}
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="AI suggestions"
                    sx={{ mb: 1, display: 'block' }}
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="System updates"
                    sx={{ mb: 1, display: 'block' }}
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Performance reports"
                    sx={{ display: 'block' }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Advanced Settings Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🔧 Advanced Configuration
                  </Typography>
                  
                  <TextField
                    fullWidth
                    label="Max Retries"
                    type="number"
                    value={settings.maxRetries}
                    onChange={(e) => handleSettingChange('maxRetries', parseInt(e.target.value))}
                    helperText="Maximum number of retry attempts for failed operations"
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Timeout (seconds)"
                    type="number"
                    value={settings.timeout}
                    onChange={(e) => handleSettingChange('timeout', parseInt(e.target.value))}
                    helperText="Request timeout for API calls"
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Log Level"
                    select
                    value={settings.logLevel}
                    onChange={(e) => handleSettingChange('logLevel', e.target.value)}
                    SelectProps={{ native: true }}
                    helperText="Logging verbosity level"
                  >
                    <option value="debug">Debug</option>
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </TextField>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🛡️ Security & Privacy
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Manage your data and security preferences.
                  </Typography>
                  
                  <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
                    Export Configuration
                  </Button>
                  <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
                    Import Configuration
                  </Button>
                  <Button variant="outlined" color="error" fullWidth>
                    Reset to Defaults
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Save Button */}
        <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
            size="large"
          >
            Save All Settings
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Settings;