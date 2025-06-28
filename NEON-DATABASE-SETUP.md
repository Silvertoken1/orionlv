# How to Get DATABASE_URL from Neon

## Step 1: Create Neon Account
1. Go to [console.neon.tech](https://console.neon.tech)
2. Sign up with GitHub, Google, or email
3. Verify your email if required

## Step 2: Create New Project
1. Click "Create Project" or "New Project"
2. Choose a project name: `bright-orion-mlm`
3. Select region: `US East (Ohio)` or closest to your users
4. Choose PostgreSQL version: `16` (latest)
5. Click "Create Project"

## Step 3: Get Connection String
1. After project creation, you'll see the dashboard
2. Click on "Connection Details" or "Connect"
3. Select "Pooled connection" (recommended for serverless)
4. Copy the connection string that looks like:
   \`\`\`
   postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   \`\`\`

## Step 4: Add to Environment Variables
1. Copy the full connection string
2. In Vercel dashboard, go to your project
3. Go to Settings → Environment Variables
4. Add new variable:
   - Name: `DATABASE_URL`
   - Value: `postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`

## Example DATABASE_URL Format:
\`\`\`
postgresql://alex:AbC123dEf@ep-cool-breeze-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
\`\`\`

## Security Notes:
- Never commit the DATABASE_URL to GitHub
- Use environment variables only
- The connection string contains your password
- Keep it secure and private

## Testing Connection:
After adding to Vercel, deploy and call:
\`\`\`bash
curl -X POST https://your-app.vercel.app/api/init-production \
-H "Content-Type: application/json" \
-d '{"authorization": "your-init-secret"}'
\`\`\`

This will create all tables and sample data automatically!
