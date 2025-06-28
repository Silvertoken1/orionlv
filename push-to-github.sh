#!/bin/bash

echo "🚀 Starting GitHub deployment..."

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

# Get current timestamp for commit message
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Commit with timestamp
echo "💾 Committing changes..."
git commit -m "Update: Fix dynamic server usage errors and complete database system - $TIMESTAMP"

# Push to GitHub
echo "🌐 Pushing to GitHub..."
if git push origin main; then
    echo "✅ Successfully pushed to GitHub!"
    echo "🎉 Your changes are now live on GitHub!"
else
    echo "❌ Failed to push to GitHub. Please check your connection and try again."
    exit 1
fi

echo "🔗 Visit your repository to see the changes."
