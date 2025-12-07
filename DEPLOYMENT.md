# Deployment Guide - Research Portal

This guide covers deploying the Research Portal to Vercel with Neon PostgreSQL.

## Prerequisites

1. Vercel account (vercel.com)
2. Neon account (console.neon.tech)
3. GitHub repository with the code
4. (Optional) Email provider account (Resend or SendGrid)

## Step 1: Setup Neon PostgreSQL Database

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project
3. Copy the connection string (looks like: `postgresql://user:password@...`)
4. Keep this safe - you'll need it for Vercel

## Step 2: Create Database Tables

Run the SQL scripts in order:

\`\`\`bash
# Using psql or Neon's SQL Editor
# Run scripts/01-init-schema.sql first
# Run scripts/02-seed-admin.sql second
\`\`\`

Or copy-paste the SQL from the scripts folder into Neon's SQL Editor.

## Step 3: Deploy to Vercel

### Option A: Via GitHub (Recommended)

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Select the project root
6. Click "Deploy"

### Option B: Via Vercel CLI

\`\`\`bash
npm i -g vercel
vercel login
vercel
\`\`\`

## Step 4: Set Environment Variables

In Vercel Dashboard:

1. Go to your project → Settings → Environment Variables
2. Add the following variables:

\`\`\`
DATABASE_URL=postgresql://user:password@host/database
JWT_SECRET=generate-a-random-string-here
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
EMAIL_PROVIDER=console
EMAIL_FROM=noreply@research-portal.com
\`\`\`

### Optional Email Provider Setup

If using Resend:
- Get API key from resend.com
- Add: `RESEND_API_KEY=your_key_here`
- Set: `EMAIL_PROVIDER=resend`

If using SendGrid:
- Get API key from sendgrid.com
- Add: `SENDGRID_API_KEY=your_key_here`
- Set: `EMAIL_PROVIDER=sendgrid`

## Step 5: Verify Deployment

1. Visit your deployed URL
2. Test the registration flow:
   - Create a new student account
   - Check console logs for verification (or email if provider configured)
   - Log in to admin account:
     - Email: `admin@university.edu`
     - Password: `admin123` (change this!)
   - Go to Admin → Registrations
   - Approve the pending registration
3. Log in with the new student account
4. Visit Profile page to verify real data loading

## Production Checklist

- [ ] Change admin password in database
- [ ] Set strong JWT_SECRET (at least 32 characters)
- [ ] Configure real email provider (don't use console in production)
- [ ] Set up custom domain
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Setup database backups (Neon has automatic backups)
- [ ] Monitor application logs in Vercel dashboard
- [ ] Test email notifications with real provider

## Troubleshooting

### "Database connection failed"
- Check DATABASE_URL is correct
- Verify Neon IP allowlist includes Vercel IP ranges
- Test connection locally first

### "Session validation failed"
- Clear browser cookies and try again
- Verify JWT_SECRET is set consistently

### "Emails not sending"
- If using console provider: check Vercel function logs
- If using real provider: verify API keys are correct
- Check email provider's dashboard for delivery status

### "Registration stuck on pending"
- Log in as admin
- Go to Admin → Registrations
- Check if pending registrations appear
- Manually approve registration

## Local Development

\`\`\`bash
# Install dependencies
npm install

# Setup .env.local with DATABASE_URL
cp .env.local.example .env.local

# Run migrations (if needed)
# Run SQL scripts in Neon console

# Start dev server
npm run dev

# Visit http://localhost:3000
\`\`\`

## Database Migrations

To make schema changes:

1. Write SQL in scripts/03-migration-name.sql
2. Run in Neon SQL Editor
3. Test locally by running script in local PostgreSQL
4. Document breaking changes

## Support

For issues:
1. Check Vercel function logs
2. Check Neon database logs
3. Review browser console for client errors
4. Check email provider dashboard if using external service
