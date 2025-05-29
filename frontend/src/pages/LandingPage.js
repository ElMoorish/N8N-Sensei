import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  alpha,
  useTheme,
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  Hub as IntegrationIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';

function LandingPage() {
  const theme = useTheme();

  const cardStyle = {
    background: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(20px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    borderRadius: '24px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)',
    },
  };

  const features = [
    {
      icon: <PsychologyIcon sx={{ fontSize: 40 }} />,
      title: 'AI-Powered Automation',
      description: 'Let our AI Sensei intelligently create, optimize, and manage your workflows with natural language processing.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Lightning Fast',
      description: 'Execute workflows 10x faster with our optimized engine and smart caching mechanisms.',
    },
    {
      icon: <IntegrationIcon sx={{ fontSize: 40 }} />,
      title: 'Seamless Integration',
      description: 'Connect with 500+ apps and services. From Slack to Salesforce, we\'ve got you covered.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Enterprise Security',
      description: 'Bank-grade security with end-to-end encryption, SOC 2 compliance, and advanced access controls.',
    },
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 40 }} />,
      title: 'Smart Suggestions',
      description: 'Get intelligent workflow recommendations based on your business patterns and industry best practices.',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      title: 'Analytics & Insights',
      description: 'Deep analytics and performance insights to optimize your automation ROI and efficiency.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CTO, TechFlow Inc.',
      avatar: 'S',
      rating: 5,
      text: 'N8N-Sensei transformed our workflow automation. We reduced manual tasks by 80% and increased productivity dramatically.',
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Operations Director, ScaleUp Co.',
      avatar: 'M',
      rating: 5,
      text: 'The AI-powered suggestions are incredible. It\'s like having a workflow expert on our team 24/7.',
    },
    {
      name: 'Emily Watson',
      role: 'Founder, AutomateNow',
      avatar: 'E',
      rating: 5,
      text: 'Best automation platform we\'ve used. The interface is beautiful and the AI capabilities are game-changing.',
    },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      features: ['Up to 1,000 executions', 'Basic AI assistance', '10 active workflows', 'Email support'],
      popular: false,
    },
    {
      name: 'Professional',
      price: '$99',
      period: '/month',
      features: ['Up to 10,000 executions', 'Advanced AI features', 'Unlimited workflows', 'Priority support', 'Analytics dashboard'],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: ['Unlimited executions', 'Custom AI training', 'Dedicated support', 'SLA guarantee', 'On-premise deployment'],
      popular: false,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: 8, pb: 8 }}>
        <Box sx={{ textAlign: 'center', color: 'white', mb: 8 }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '4rem' },
              mb: 3,
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            🥋 N8N-Sensei
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 300,
              mb: 4,
              opacity: 0.9,
              fontSize: { xs: '1.2rem', md: '1.8rem' },
            }}
          >
            Your AI Workflow Automation Master
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 6,
              opacity: 0.8,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Transform your business with intelligent automation. Let our AI Sensei create, optimize, and manage your workflows while you focus on what matters most.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50px',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              Start Free Trial
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<PlayArrowIcon />}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.5)',
                color: 'white',
                borderRadius: '50px',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'white',
                  background: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Watch Demo
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Features Section */}
      <Box sx={{ background: theme.palette.background.default, py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            sx={{ 
              textAlign: 'center',
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Why Choose N8N-Sensei?
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              textAlign: 'center',
              color: 'text.secondary',
              mb: 6,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Powerful features designed to supercharge your workflow automation
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={cardStyle}>
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box 
                      sx={{ 
                        color: 'primary.main',
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            sx={{ 
              textAlign: 'center',
              fontWeight: 700,
              mb: 2,
              color: 'white',
            }}
          >
            What Our Customers Say
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.8)',
              mb: 6,
            }}
          >
            Join thousands of satisfied customers who trust N8N-Sensei
          </Typography>
          
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{
                  ...cardStyle,
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} sx={{ color: '#FFD700', fontSize: 20 }} />
                      ))}
                    </Box>
                    <Typography variant="body1" sx={{ mb: 3, color: 'white', fontStyle: 'italic' }}>
                      "{testimonial.text}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ background: theme.palette.background.default, py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            sx={{ 
              textAlign: 'center',
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Simple, Transparent Pricing
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              textAlign: 'center',
              color: 'text.secondary',
              mb: 6,
            }}
          >
            Choose the plan that fits your automation needs
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{
                  ...cardStyle,
                  position: 'relative',
                  ...(plan.popular && {
                    border: '2px solid #667eea',
                    transform: 'scale(1.05)',
                  }),
                }}>
                  {plan.popular && (
                    <Chip
                      label="Most Popular"
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  )}
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                      {plan.name}
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {plan.price}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {plan.period}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 4 }}>
                      {plan.features.map((feature, i) => (
                        <Typography key={i} variant="body2" sx={{ mb: 1 }}>
                          ✓ {feature}
                        </Typography>
                      ))}
                    </Box>
                    <Button
                      variant={plan.popular ? "contained" : "outlined"}
                      fullWidth
                      sx={{
                        borderRadius: '12px',
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'none',
                        ...(plan.popular && {
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                          },
                        }),
                      }}
                    >
                      {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="md">
          <Card sx={{
            ...cardStyle,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
          }}>
            <CardContent sx={{ p: 6 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: 'white' }}>
                Ready to Transform Your Workflows?
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.8)' }}>
                Join thousands of businesses already using N8N-Sensei to automate their success.
              </Typography>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '50px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                Start Your Free Trial Today
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage;