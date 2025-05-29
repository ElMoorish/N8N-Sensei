import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Send as SendIcon,
  Psychology as AIIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';

const aiProviders = [
  { value: 'llama', label: '🦙 LLama (Local)', available: true },
  { value: 'lm_studio', label: '🏠 LM Studio', available: true },
  { value: 'ollama', label: '🔮 Ollama', available: false },
  { value: 'openai', label: '🤖 OpenAI', available: false },
  { value: 'anthropic', label: '🧠 Anthropic', available: true },
  { value: 'openrouter', label: '🌐 OpenRouter', available: false },
];

function AIChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `🥋 **Welcome to N8N-Sensei!**

I'm your AI Workflow Sensei, here to help you master N8N automation. I can:

• **Generate workflows** from natural language descriptions
• **Optimize existing workflows** for better performance  
• **Fill in parameters** intelligently based on context
• **Explain workflows** in simple terms
• **Troubleshoot issues** and suggest improvements

What would you like to work on today?`,
      timestamp: new Date(),
      provider: 'llama'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('llama');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      provider: selectedProvider
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Mock API call - replace with actual API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          session_id: sessionId,
          ai_provider: selectedProvider,
          workflow_context: null
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          provider: selectedProvider,
          suggestions: data.suggestions,
          workflow_action: data.workflow_action
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      // Mock response for demo
      const mockResponse = generateMockResponse(inputMessage, selectedProvider);
      
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: mockResponse,
        timestamp: new Date(),
        provider: selectedProvider
      };

      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResponse = (message, provider) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('create') || lowerMessage.includes('generate')) {
      return `🎯 **Workflow Generation Request Detected!**

I can help you create a workflow for "${message}". Here's what I'll do:

1. **Analyze your requirements** - Understanding the automation goal
2. **Design the workflow structure** - Planning nodes and connections  
3. **Generate N8N JSON** - Creating the actual workflow code
4. **Optimize for performance** - Ensuring efficient execution

Would you like me to proceed with generating this workflow? I'll use **${provider}** AI to create something amazing! 🚀`;
    }
    
    if (lowerMessage.includes('optimize') || lowerMessage.includes('improve')) {
      return `⚡ **Workflow Optimization Mode Activated!**

I can analyze and optimize your workflows using **${provider}** AI. Here's my optimization approach:

• **Performance Analysis** - Identifying bottlenecks
• **Resource Optimization** - Reducing memory and CPU usage
• **Error Handling** - Adding robust error management
• **Best Practices** - Implementing N8N conventions

Please provide the workflow ID or paste the workflow JSON, and I'll give you detailed optimization recommendations! 📈`;
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      return `🤝 **N8N-Sensei Help Center**

I'm here to guide you through N8N automation mastery! Here are my capabilities:

**🔧 Workflow Management:**
- Create workflows from descriptions
- Modify existing workflows
- Debug and troubleshoot issues

**🧠 AI-Powered Features:**
- Intelligent parameter filling
- Performance optimization
- Code generation and explanation

**📚 Learning & Training:**
- Best practices guidance
- Workflow pattern recommendations
- Step-by-step tutorials

What specific area would you like help with? I'm powered by **${provider}** and ready to assist! 💪`;
    }
    
    return `Thank you for your message! I'm processing this using **${provider}** AI. 

Your request: "${message}"

I'm continuously learning and improving my responses. In a full implementation, I would:

1. Analyze your specific N8N automation needs
2. Provide detailed, actionable guidance
3. Generate actual workflow code when requested
4. Offer optimization suggestions

Is there a specific N8N workflow challenge you'd like help with? 🤔`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        🤖 AI Chat - Your Workflow Sensei
      </Typography>

      <Card sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
        {/* Chat Header */}
        <CardContent sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>AI Provider</InputLabel>
                <Select
                  value={selectedProvider}
                  label="AI Provider"
                  onChange={(e) => setSelectedProvider(e.target.value)}
                >
                  {aiProviders.map((provider) => (
                    <MenuItem 
                      key={provider.value} 
                      value={provider.value}
                      disabled={!provider.available}
                    >
                      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                        {provider.label}
                        <Chip 
                          size="small" 
                          label={provider.available ? 'Online' : 'Offline'}
                          color={provider.available ? 'success' : 'error'}
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <IconButton onClick={() => window.location.reload()}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </CardContent>

        {/* Messages Area */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          {messages.map((message) => (
            <Box key={message.id} sx={{ mb: 2 }}>
              <Box display="flex" alignItems="flex-start" gap={2}>
                <Avatar sx={{ 
                  bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main',
                  width: 32, 
                  height: 32 
                }}>
                  {message.role === 'user' ? <PersonIcon /> : <AIIcon />}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {message.role === 'user' ? 'You' : 'N8N-Sensei'}
                    </Typography>
                    <Chip 
                      size="small" 
                      label={message.provider} 
                      variant="outlined"
                      sx={{ textTransform: 'capitalize' }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      {message.timestamp.toLocaleTimeString()}
                    </Typography>
                  </Box>
                  <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                    {message.suggestions && (
                      <Box sx={{ mt: 2 }}>
                        <Divider sx={{ mb: 1 }} />
                        <Typography variant="caption" color="textSecondary">
                          Suggestions:
                        </Typography>
                        {message.suggestions.map((suggestion, index) => (
                          <Chip 
                            key={index}
                            label={suggestion}
                            size="small"
                            sx={{ mr: 1, mt: 1 }}
                            onClick={() => setInputMessage(suggestion)}
                          />
                        ))}
                      </Box>
                    )}
                  </Paper>
                  <IconButton 
                    size="small" 
                    onClick={() => copyToClipboard(message.content)}
                    sx={{ mt: 1 }}
                  >
                    <CopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ))}
          {isLoading && (
            <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                <AIIcon />
              </Avatar>
              <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography>N8N-Sensei is thinking... 🤔</Typography>
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <CardContent sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Ask your AI Sensei about workflows, automation, or anything N8N related..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              sx={{ minWidth: 100 }}
            >
              Send
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AIChat;