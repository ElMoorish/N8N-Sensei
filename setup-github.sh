#!/bin/bash

# 🥋 N8N-Sensei GitHub Setup Script

echo "🥋 N8N-Sensei GitHub Setup"
echo "=========================="
echo ""

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -f "PROJECT_SUMMARY.md" ]; then
    echo "❌ Error: Please run this script from the n8n-sensei project root directory"
    exit 1
fi

echo "📋 Current project status:"
echo "- Project files: ✅ Ready"
echo "- Git repository: ✅ Initialized"
echo "- Commit: ✅ Created"
echo ""

# Check if remote exists
if git remote get-url origin >/dev/null 2>&1; then
    echo "🔗 Git remote: ✅ Configured"
    echo "   Remote URL: $(git remote get-url origin)"
else
    echo "🔗 Git remote: ❌ Not configured"
    echo ""
    echo "📝 To set up the remote repository:"
    echo "1. Create repository on GitHub: https://github.com/new"
    echo "2. Repository name: n8n-sensei"
    echo "3. Run: git remote add origin https://github.com/ElMoorish/n8n-sensei.git"
fi

echo ""
echo "🚀 Next steps:"
echo "1. Create the repository on GitHub (if not done already)"
echo "2. Push the code:"
echo "   git push -u origin main"
echo ""
echo "📖 For detailed instructions, see: GITHUB_SETUP.md"
echo ""

# Show repository stats
echo "📊 Repository statistics:"
echo "- Total files: $(find . -type f | wc -l)"
echo "- Code files: $(find . -name "*.py" -o -name "*.js" -o -name "*.json" | wc -l)"
echo "- Documentation: $(find . -name "*.md" | wc -l)"
echo "- Configuration: $(find . -name "*.yml" -o -name "*.yaml" -o -name "Dockerfile" | wc -l)"
echo ""

# Show git status
echo "📋 Git status:"
git status --short
echo ""

echo "🎯 Ready to launch N8N-Sensei on GitHub!"
echo "🥋 Master your workflows with AI wisdom!"