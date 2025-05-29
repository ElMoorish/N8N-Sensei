import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Popover,
  Card,
  CardContent,
  Chip,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Psychology as AIIcon,
  AccountTree as WorkflowIcon,
  School as TrainingIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,

  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
  Brightness4 as ThemeIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/', description: 'System overview' },
  { text: 'AI Chat', icon: <AIIcon />, path: '/ai-chat', description: 'Workflow assistant' },
  { text: 'Workflow Dojo', icon: <WorkflowIcon />, path: '/workflow-dojo', description: 'Automation studio' },
  { text: 'Training Hub', icon: <TrainingIcon />, path: '/training-hub', description: 'Learn & improve' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings', description: 'Configuration' },
  { text: 'Profile Settings', icon: <AccountIcon />, path: '/profile-settings', description: 'Personal information' },
  { text: 'Preferences', icon: <ThemeIcon />, path: '/preferences', description: 'App preferences' },
];

// Mock notifications data
const notifications = [
  { id: 1, title: 'Workflow Completed', message: 'Daily email reminder workflow executed successfully', time: '2 min ago', type: 'success' },
  { id: 2, title: 'AI Model Updated', message: 'Ollama model llama3.2:1b is now available', time: '1 hour ago', type: 'info' },
  { id: 3, title: 'System Alert', message: 'High CPU usage detected on workflow execution', time: '3 hours ago', type: 'warning' },
];

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    handleUserMenuClose();
  };

  const drawer = (
    <Box
      sx={{
        height: '100%',
        background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        borderRight: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
          }}
        >
          🥋 N8N-Sensei
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
            letterSpacing: '0.5px',
          }}
        >
          AI Workflow Automation
        </Typography>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ p: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 2,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: alpha('#667eea', 0.08),
                  transform: 'translateX(4px)',
                },
                '&.Mui-selected': {
                  backgroundColor: '#667eea',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    backgroundColor: '#5a67d8',
                    transform: 'translateX(4px)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: location.pathname === item.path ? 'white' : '#667eea',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <Box>
                <ListItemText
                  primary={item.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: 600,
                      fontSize: '0.95rem',
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: location.pathname === item.path ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                    fontSize: '0.75rem',
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important', px: 3 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              color: '#667eea',
              '&:hover': { backgroundColor: alpha('#667eea', 0.08) }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant="h6" 
              noWrap 
              component="div" 
              sx={{ 
                fontWeight: 600,
                color: '#1a202c',
                letterSpacing: '-0.25px',
              }}
            >
              {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                fontWeight: 500,
              }}
            >
              {menuItems.find(item => item.path === location.pathname)?.description || 'System overview'}
            </Typography>
          </Box>

          {/* Notification Bell */}
          <IconButton
            onClick={handleNotificationOpen}
            sx={{
              mr: 1,
              color: '#667eea',
              '&:hover': { backgroundColor: alpha('#667eea', 0.08) },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Badge 
              badgeContent={notifications.length} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }
              }}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* User Avatar */}
          <IconButton
            onClick={handleUserMenuOpen}
            sx={{
              p: 0,
              ml: 1,
              '&:hover': { transform: 'scale(1.05)' },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              S
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          background: '#fafbfc',
          minHeight: '100vh',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important' }} />
        {children}
      </Box>

      {/* Notification Popover */}
      <Popover
        open={Boolean(notificationAnchor)}
        anchorEl={notificationAnchor}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            width: 380,
            maxHeight: 480,
            borderRadius: 2,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '1px solid rgba(0,0,0,0.06)',
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a202c' }}>
              Notifications
            </Typography>
            <IconButton 
              size="small" 
              onClick={handleNotificationClose}
              sx={{ color: 'text.secondary' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              sx={{ 
                mb: 1.5, 
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: 'none',
                '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {notification.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {notification.time}
                    </Typography>
                  </Box>
                  <Chip
                    label={notification.type}
                    size="small"
                    color={
                      notification.type === 'success' ? 'success' :
                      notification.type === 'warning' ? 'warning' : 'info'
                    }
                    sx={{ ml: 1, fontSize: '0.7rem' }}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Popover>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '1px solid rgba(0,0,0,0.06)',
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Sensei User
          </Typography>
          <Typography variant="caption" color="text.secondary">
            sensei@n8n-sensei.ai
          </Typography>
        </Box>
        
        <MenuItem 
          onClick={() => { navigate('/profile-settings'); handleUserMenuClose(); }}
          sx={{ py: 1.5, '&:hover': { backgroundColor: alpha('#667eea', 0.08) } }}
        >
          <ListItemIcon sx={{ color: '#667eea' }}>
            <AccountIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Profile Settings" />
        </MenuItem>
        
        <MenuItem 
          onClick={() => { navigate('/preferences'); handleUserMenuClose(); }}
          sx={{ py: 1.5, '&:hover': { backgroundColor: alpha('#667eea', 0.08) } }}
        >
          <ListItemIcon sx={{ color: '#667eea' }}>
            <ThemeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Preferences" />
        </MenuItem>
        
        <Divider sx={{ my: 1 }} />
        
        <MenuItem 
          onClick={handleLogout}
          sx={{ 
            py: 1.5, 
            color: '#ef4444',
            '&:hover': { backgroundColor: alpha('#ef4444', 0.08) }
          }}
        >
          <ListItemIcon sx={{ color: '#ef4444' }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Sign Out" />
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default Layout;