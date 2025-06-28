#!/bin/bash

echo "🚀 Deploying Bright Orion MLM System to Production..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not a git repository. Please run 'git init' first."
    exit 1
fi

# Add all changes
echo "📁 Adding all changes..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "ℹ️ No changes to commit."
else
    # Commit changes
    echo "💾 Committing changes..."
    git commit -m "Deploy: Production database setup with Neon PostgreSQL

- Complete Neon database integration
- Production-ready authentication system
- Full MLM system with users, commissions, pins
- Admin dashboard with real-time stats
- Stockist management system
- Sample data for testing
- Environment variables configuration
- Database initialization endpoint"
fi

# Push to GitHub
echo "🔄 Pushing to GitHub..."
git push origin main

echo "✅ Successfully deployed to GitHub!"
echo ""
echo "🔧 Next Steps for Vercel Deployment:"
echo "1. Go to https://vercel.com and import your GitHub repository"
echo "2. Add these environment variables in Vercel dashboard:"
echo "   - DATABASE_URL (your Neon PostgreSQL connection string)"
echo "   - JWT_SECRET (generate a secure 32+ character string)"
echo "   - ADMIN_EMAIL (your admin email)"
echo "   - ADMIN_PASSWORD (secure admin password)"
echo "   - INIT_SECRET (secret key for database initialization)"
echo ""
echo "3. After deployment, initialize the database by calling:"
echo "   POST https://your-app.vercel.app/api/init-production"
echo "   Body: { \"authorization\": \"your-init-secret\" }"
echo ""
echo "4. Test login with these credentials:"
echo "   Admin: admin@brightorian.com / BrightAdmin2024!"
echo "   User: john.doe@brightorian.com / BrightUser2024!"
echo ""
echo "🎉 Your MLM system is ready for production!"
