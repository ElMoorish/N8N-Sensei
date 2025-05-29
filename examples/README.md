# 🥋 N8N-Sensei Examples

This directory contains example workflows and use cases demonstrating the power of N8N-Sensei.

## 📁 Example Files

### 1. `sample_workflow.json`
**AI-Generated Email Automation**
- **Description**: Daily weather email automation
- **Features**: 
  - Scheduled execution (daily)
  - Weather API integration
  - AI-powered email formatting
  - Automated email sending
- **AI Provider**: LLama (Local)
- **Use Case**: Personal weather updates

## 🚀 How to Use Examples

### Import into N8N
1. Open N8N Editor (http://localhost:5678)
2. Click "Import from File"
3. Select the example JSON file
4. Configure API keys and email settings
5. Activate the workflow

### Generate Similar Workflows
1. Open N8N-Sensei Dashboard (http://localhost:3000)
2. Go to "AI Chat"
3. Ask: "Create a workflow similar to the weather email example"
4. Customize the AI-generated workflow

## 🎯 Example Use Cases

### 1. **Business Automation**
```
"Create a workflow that monitors our website uptime, 
sends Slack alerts when down, and logs incidents to Google Sheets"
```

### 2. **Data Processing**
```
"Build a workflow that processes CSV files from email attachments, 
validates the data, and imports it into our database"
```

### 3. **Social Media Management**
```
"Generate a workflow that posts daily content to Twitter and LinkedIn 
based on RSS feed updates from our blog"
```

### 4. **Customer Support**
```
"Create an automation that monitors support emails, 
categorizes them using AI, and assigns to appropriate team members"
```

### 5. **E-commerce Integration**
```
"Build a workflow that syncs orders from Shopify to our inventory system 
and sends shipping notifications to customers"
```

## 🤖 AI-Powered Features

### Intelligent Parameter Filling
- AI suggests optimal values based on context
- Historical data analysis
- Best practices recommendations

### Workflow Optimization
- Performance bottleneck detection
- Resource usage optimization
- Error handling improvements

### Natural Language Generation
- Human-readable workflow descriptions
- Automated documentation
- Code comments and explanations

## 📚 Learning Resources

### Beginner Workflows
- Simple HTTP requests
- Basic data transformations
- Email notifications
- File operations

### Intermediate Workflows
- API integrations
- Database operations
- Conditional logic
- Error handling

### Advanced Workflows
- Multi-step data processing
- AI service integrations
- Complex business logic
- Performance optimization

## 🛠️ Customization Tips

### 1. **API Keys**
- Replace placeholder API keys with your own
- Store sensitive data in environment variables
- Use N8N credentials manager

### 2. **Scheduling**
- Adjust cron expressions for your timezone
- Consider rate limits and quotas
- Plan for peak usage times

### 3. **Error Handling**
- Add try-catch blocks for external APIs
- Implement retry mechanisms
- Set up monitoring and alerts

### 4. **Performance**
- Optimize data transformations
- Use batch operations when possible
- Monitor execution times

## 🎨 Workflow Templates

### Email Automation Template
```json
{
  "trigger": "schedule|webhook|manual",
  "data_source": "api|database|file",
  "processing": "ai_format|transform|validate",
  "action": "email|slack|database|file"
}
```

### Data Sync Template
```json
{
  "source": "system_a",
  "destination": "system_b", 
  "transformation": "ai_mapping|custom_logic",
  "validation": "schema|business_rules",
  "error_handling": "retry|alert|log"
}
```

### Monitoring Template
```json
{
  "monitor": "website|service|database",
  "check_frequency": "1min|5min|hourly",
  "alert_channels": "email|slack|sms",
  "escalation": "team|manager|oncall"
}
```

## 🔧 Troubleshooting Examples

### Common Issues
1. **API Rate Limits**: Add delays between requests
2. **Authentication Errors**: Check API keys and permissions
3. **Data Format Issues**: Use AI to suggest transformations
4. **Timeout Errors**: Increase timeout values or add retries

### Debug Tips
1. Use N8N's execution log
2. Add debug nodes to inspect data
3. Test with small datasets first
4. Use AI Chat for troubleshooting help

## 🚀 Contributing Examples

### How to Contribute
1. Create your workflow in N8N
2. Export as JSON
3. Add documentation and use case description
4. Test thoroughly
5. Submit as example

### Example Naming Convention
- `{category}_{use_case}_{complexity}.json`
- Example: `business_crm_sync_intermediate.json`

### Documentation Requirements
- Clear description
- Prerequisites and setup
- Configuration steps
- Expected outcomes
- Troubleshooting tips

---

**🥋 Master your workflows with N8N-Sensei examples!**

*Happy automating! 🚀*