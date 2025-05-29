import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Divider,
  Slider,
  Alert,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Palette as PaletteIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Speed as SpeedIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

function Preferences() {
  const theme = useTheme();
  const [showSuccess, setShowSuccess] = useState(false);
  const [preferences, setPreferences] = useState({
    // Appearance
    darkMode: false,
    colorScheme: 'blue',
    compactMode: false,
    animations: true,
    
    // Notifications
    pushNotifications: true,
    emailNotifications: true,
    workflowAlerts: true,
    systemUpdates: false,
    
    // Workflow
    autoSave: true,
    autoExecute: false,
    debugMode: false,
    maxExecutionTime: 300,
    
    // Language & Region
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    
    // Performance
    cacheEnabled: true,
    preloadData: true,
    animationSpeed: 50,
  });

  const cardStyle = {
    background: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(20px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  };

  const handleSwitchChange = (field) => (event) => {
    setPreferences({
      ...preferences,
      [field]: event.target.checked,
    });
  };

  const handleSelectChange = (field) => (event) => {
    setPreferences({
      ...preferences,
      [field]: event.target.value,
    });
  };

  const handleSliderChange = (field) => (event, value) => {
    setPreferences({
      ...preferences,
      [field]: value,
    });
  };

  const handleSave = () => {
    // Simulate API call
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          ⚙️ Preferences
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Customize your N8N-Sensei experience to match your workflow
        </Typography>
      </Box>

      {showSuccess && (
        <Alert 
          severity="success" 
          sx={{ mb: 3, borderRadius: '12px' }}
          onClose={() => setShowSuccess(false)}
        >
          Preferences saved successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Appearance Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaletteIcon />
                Appearance
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.darkMode}
                      onChange={handleSwitchChange('darkMode')}
                      color="primary"
                    />
                  }
                  label="Dark Mode"
                />
                
                <FormControl fullWidth>
                  <InputLabel>Color Scheme</InputLabel>
                  <Select
                    value={preferences.colorScheme}
                    onChange={handleSelectChange('colorScheme')}
                    label="Color Scheme"
                    sx={{ borderRadius: '12px' }}
                  >
                    <MenuItem value="blue">Blue (Default)</MenuItem>
                    <MenuItem value="purple">Purple</MenuItem>
                    <MenuItem value="green">Green</MenuItem>
                    <MenuItem value="orange">Orange</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.compactMode}
                      onChange={handleSwitchChange('compactMode')}
                      color="primary"
                    />
                  }
                  label="Compact Mode"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.animations}
                      onChange={handleSwitchChange('animations')}
                      color="primary"
                    />
                  }
                  label="Enable Animations"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotificationsIcon />
                Notifications
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.pushNotifications}
                      onChange={handleSwitchChange('pushNotifications')}
                      color="primary"
                    />
                  }
                  label="Push Notifications"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.emailNotifications}
                      onChange={handleSwitchChange('emailNotifications')}
                      color="primary"
                    />
                  }
                  label="Email Notifications"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.workflowAlerts}
                      onChange={handleSwitchChange('workflowAlerts')}
                      color="primary"
                    />
                  }
                  label="Workflow Alerts"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.systemUpdates}
                      onChange={handleSwitchChange('systemUpdates')}
                      color="primary"
                    />
                  }
                  label="System Updates"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Workflow Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SettingsIcon />
                Workflow Settings
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.autoSave}
                      onChange={handleSwitchChange('autoSave')}
                      color="primary"
                    />
                  }
                  label="Auto-save Workflows"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.autoExecute}
                      onChange={handleSwitchChange('autoExecute')}
                      color="primary"
                    />
                  }
                  label="Auto-execute on Save"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.debugMode}
                      onChange={handleSwitchChange('debugMode')}
                      color="primary"
                    />
                  }
                  label="Debug Mode"
                />
                
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Max Execution Time: {preferences.maxExecutionTime}s
                  </Typography>
                  <Slider
                    value={preferences.maxExecutionTime}
                    onChange={handleSliderChange('maxExecutionTime')}
                    min={30}
                    max={600}
                    step={30}
                    marks={[
                      { value: 30, label: '30s' },
                      { value: 300, label: '5m' },
                      { value: 600, label: '10m' },
                    ]}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Language & Region */}
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LanguageIcon />
                Language & Region
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={preferences.language}
                    onChange={handleSelectChange('language')}
                    label="Language"
                    sx={{ borderRadius: '12px' }}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Español</MenuItem>
                    <MenuItem value="fr">Français</MenuItem>
                    <MenuItem value="de">Deutsch</MenuItem>
                    <MenuItem value="zh">中文</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={preferences.timezone}
                    onChange={handleSelectChange('timezone')}
                    label="Timezone"
                    sx={{ borderRadius: '12px' }}
                  >
                    <MenuItem value="UTC">UTC</MenuItem>
                    <MenuItem value="EST">Eastern Time</MenuItem>
                    <MenuItem value="PST">Pacific Time</MenuItem>
                    <MenuItem value="CET">Central European Time</MenuItem>
                    <MenuItem value="JST">Japan Standard Time</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Date Format</InputLabel>
                  <Select
                    value={preferences.dateFormat}
                    onChange={handleSelectChange('dateFormat')}
                    label="Date Format"
                    sx={{ borderRadius: '12px' }}
                  >
                    <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                    <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                    <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Settings */}
        <Grid item xs={12}>
          <Card sx={cardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SpeedIcon />
                Performance
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.cacheEnabled}
                        onChange={handleSwitchChange('cacheEnabled')}
                        color="primary"
                      />
                    }
                    label="Enable Caching"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.preloadData}
                        onChange={handleSwitchChange('preloadData')}
                        color="primary"
                      />
                    }
                    label="Preload Data"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Animation Speed: {preferences.animationSpeed}%
                    </Typography>
                    <Slider
                      value={preferences.animationSpeed}
                      onChange={handleSliderChange('animationSpeed')}
                      min={0}
                      max={100}
                      step={10}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
              }}
            >
              Reset to Defaults
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
              }}
            >
              Save Preferences
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Preferences;