#!/bin/bash

echo "🚀 Starting GitHub deployment process..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not a git repository. Please run 'git init' first."
    exit 1
fi

# Add all changes
echo "📁 Adding all changes..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit."
    exit 0
fi

# Get current timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Commit with timestamp
echo "💾 Committing changes..."
git commit -m "Update: Mobile image fixes and responsive design improvements - $TIMESTAMP"

# Push to GitHub
echo "🌐 Pushing to GitHub..."
if git push origin main; then
    echo "✅ Successfully pushed to GitHub!"
    echo "🎉 Your changes are now live on GitHub!"
else
    echo "❌ Failed to push to GitHub. Trying to set upstream..."
    if git push -u origin main; then
        echo "✅ Successfully pushed to GitHub with upstream set!"
    else
        echo "❌ Failed to push. Please check your GitHub repository settings."
        exit 1
    fi
fi

echo "🔗 You can now deploy to Vercel or other platforms!"
