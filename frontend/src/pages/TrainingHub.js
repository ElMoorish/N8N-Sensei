import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  School as SchoolIcon,
  CheckCircle as CheckIcon,
  PlayCircle as PlayIcon,
  MenuBook as BookIcon,
  Code as CodeIcon,
  Psychology as AIIcon,
  Star as StarIcon,
} from '@mui/icons-material';

const trainingModules = [
  {
    id: 1,
    title: 'N8N Fundamentals',
    description: 'Learn the basics of N8N workflow automation',
    difficulty: 'Beginner',
    duration: '2 hours',
    progress: 100,
    completed: true,
    lessons: [
      'Introduction to N8N',
      'Creating Your First Workflow',
      'Understanding Nodes',
      'Connecting Nodes',
      'Testing Workflows'
    ]
  },
  {
    id: 2,
    title: 'Advanced Node Configuration',
    description: 'Master complex node setups and configurations',
    difficulty: 'Intermediate',
    duration: '3 hours',
    progress: 65,
    completed: false,
    lessons: [
      'HTTP Request Nodes',
      'Database Operations',
      'Conditional Logic',
      'Error Handling',
      'Custom Functions'
    ]
  },
  {
    id: 3,
    title: 'AI-Powered Workflows',
    description: 'Integrate AI services into your automation workflows',
    difficulty: 'Advanced',
    duration: '4 hours',
    progress: 0,
    completed: false,
    lessons: [
      'AI Service Integration',
      'Natural Language Processing',
      'Image Recognition Workflows',
      'Chatbot Creation',
      'AI Decision Making'
    ]
  }
];

const bestPractices = [
  {
    title: 'Workflow Organization',
    description: 'Keep your workflows clean and well-documented',
    tips: [
      'Use descriptive node names',
      'Add notes to complex logic',
      'Group related workflows',
      'Use consistent naming conventions'
    ]
  },
  {
    title: 'Error Handling',
    description: 'Build robust workflows that handle failures gracefully',
    tips: [
      'Always add error handling nodes',
      'Set appropriate timeouts',
      'Log errors for debugging',
      'Implement retry mechanisms'
    ]
  },
  {
    title: 'Performance Optimization',
    description: 'Make your workflows fast and efficient',
    tips: [
      'Minimize API calls',
      'Use batch operations when possible',
      'Optimize data transformations',
      'Monitor execution times'
    ]
  }
];

const aiTips = [
  {
    title: 'Prompt Engineering for Workflows',
    description: 'Learn how to write effective prompts for AI workflow generation',
    icon: '🎯'
  },
  {
    title: 'AI-Assisted Debugging',
    description: 'Use AI to identify and fix workflow issues',
    icon: '🔍'
  },
  {
    title: 'Intelligent Parameter Filling',
    description: 'Let AI suggest optimal parameter values',
    icon: '⚡'
  },
  {
    title: 'Workflow Optimization with AI',
    description: 'Improve performance using AI recommendations',
    icon: '🚀'
  }
];

function TrainingHub() {
  const [expandedModule, setExpandedModule] = useState(null);

  const handleModuleExpand = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        📚 Training Hub - Master Your Skills
      </Typography>

      {/* Progress Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <SchoolIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">Learning Progress</Typography>
                  <Typography color="textSecondary">
                    {trainingModules.filter(m => m.completed).length} of {trainingModules.length} modules completed
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(trainingModules.filter(m => m.completed).length / trainingModules.length) * 100}
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <AIIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">AI Mastery</Typography>
                  <Typography color="textSecondary">
                    Advanced AI integration skills
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" gap={1} sx={{ mt: 2 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon 
                    key={star} 
                    color={star <= 3 ? 'primary' : 'disabled'} 
                    fontSize="small"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <CheckIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">Certification</Typography>
                  <Typography color="textSecondary">
                    N8N-Sensei Certified
                  </Typography>
                </Box>
              </Box>
              <Chip 
                label="In Progress" 
                color="warning" 
                size="small" 
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Training Modules */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🎓 Training Modules
          </Typography>
          {trainingModules.map((module) => (
            <Accordion 
              key={module.id}
              expanded={expandedModule === module.id}
              onChange={() => handleModuleExpand(module.id)}
              sx={{ mb: 1 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: module.completed ? 'success.main' : 'grey.500' }}>
                      {module.completed ? <CheckIcon /> : <BookIcon />}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {module.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {module.description}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2} sx={{ mr: 2 }}>
                    <Chip 
                      label={module.difficulty}
                      color={getDifficultyColor(module.difficulty)}
                      size="small"
                    />
                    <Typography variant="caption" color="textSecondary">
                      {module.duration}
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={module.progress}
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Progress: {module.progress}%
                  </Typography>
                  <List dense>
                    {module.lessons.map((lesson, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckIcon 
                            color={index < (module.lessons.length * module.progress / 100) ? 'success' : 'disabled'}
                            fontSize="small"
                          />
                        </ListItemIcon>
                        <ListItemText primary={lesson} />
                      </ListItem>
                    ))}
                  </List>
                  <Button 
                    variant={module.completed ? 'outlined' : 'contained'}
                    startIcon={module.completed ? <CheckIcon /> : <PlayIcon />}
                    sx={{ mt: 2 }}
                  >
                    {module.completed ? 'Review' : 'Continue Learning'}
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>

      {/* Best Practices & AI Tips */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💡 Best Practices
              </Typography>
              {bestPractices.map((practice, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    {practice.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {practice.description}
                  </Typography>
                  <List dense>
                    {practice.tips.map((tip, tipIndex) => (
                      <ListItem key={tipIndex} sx={{ py: 0 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <CheckIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={tip}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  {index < bestPractices.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🤖 AI Sensei Tips
              </Typography>
              {aiTips.map((tip, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} sx={{ mb: 1 }}>
                    <Typography variant="h6">{tip.icon}</Typography>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {tip.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {tip.description}
                  </Typography>
                  {index < aiTips.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}
              <Button 
                variant="contained" 
                startIcon={<AIIcon />}
                fullWidth
                sx={{ mt: 2 }}
              >
                Chat with AI Sensei
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TrainingHub;