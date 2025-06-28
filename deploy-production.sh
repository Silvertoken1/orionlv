#!/bin/bash

echo "🚀 Deploying Bright Orion MLM System to GitHub..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
fi

# Add all files
echo "📁 Adding all files..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "⚠️  No changes to commit"
    exit 0
fi

# Commit with timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
echo "💾 Committing changes..."
git commit -m "Production deployment: Complete MLM system with Neon database - $TIMESTAMP"

# Push to GitHub
echo "🌐 Pushing to GitHub..."
if git remote get-url origin > /dev/null 2>&1; then
    git push origin main
else
    echo "❌ No remote origin found. Please add your GitHub repository:"
    echo "git remote add origin https://github.com/yourusername/your-repo.git"
    echo "git push -u origin main"
    exit 1
fi

echo "✅ Deployment completed successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Set up Neon database (see NEON-DATABASE-SETUP.md)"
echo "2. Add environment variables to Vercel"
echo "3. Deploy to Vercel"
echo "4. Initialize database with /api/init-production"
echo ""
echo "🎯 Environment variables needed:"
echo "- DATABASE_URL (from Neon)"
echo "- JWT_SECRET (32+ characters)"
echo "- INIT_SECRET (for database init)"
echo "- PAYSTACK_PUBLIC_KEY (provided)"
echo "- PAYSTACK_SECRET_KEY (provided)"
