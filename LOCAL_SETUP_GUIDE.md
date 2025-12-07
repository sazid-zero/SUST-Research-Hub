# Local Development Setup Guide

## Environment Variables Configuration

This guide explains exactly where to put all required environment variables for local development.

---

## Step 1: Create `.env.local` File

In the **root directory** of your project, create a file named `.env.local`:

\`\`\`bash
# From the project root:
touch .env.local
\`\`\`

This file should **NEVER** be committed to git. It's already in `.gitignore`.

---

## Step 2: Add Environment Variables

Copy and paste the following into your `.env.local` file. Replace the placeholder values with your actual credentials:

\`\`\`env
# ============================================
# DATABASE CONFIGURATION (Neon)
# ============================================
# Required for database operations
# Get this from: https://console.neon.tech
# Format: postgresql://user:password@host/database
DATABASE_URL="postgresql://user:password@ep-xyz.us-east-1.neon.tech/thesis_repo"

# ============================================
# EMAIL CONFIGURATION
# ============================================
# Choose ONE email provider: 'resend', 'sendgrid', or 'console'
# Default is 'console' (logs to terminal)
EMAIL_PROVIDER="resend"

# Resend API Key
# Get this from: https://resend.com/api-keys
# Only needed if EMAIL_PROVIDER="resend"
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxx"

# SendGrid API Key
# Get this from: https://app.sendgrid.com/settings/api_keys
# Only needed if EMAIL_PROVIDER="sendgrid"
SENDGRID_API_KEY="SG.xxxxxxxxxxxxxxxxxxxxx"

# Email sender address
# For Resend: verified domain email (default: onboarding@resend.dev)
# For SendGrid: verified email address
# Format: your-email@yourdomain.com or support@yourdomain.com
EMAIL_FROM="noreply@thesis-repo.com"

# ============================================
# SITE CONFIGURATION
# ============================================
# The public URL of your application
# For local development, this is always:
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# ============================================
# ADMIN CONFIGURATION
# ============================================
# Email address where admin notifications are sent
# This admin will receive emails about pending registrations
ADMIN_EMAIL="admin@thesis.com"

# ============================================
# AUTHENTICATION
# ============================================
# Secret key for JWT tokens and sessions
# Generate a random string (at least 32 characters)
# Command to generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET="your_super_secret_key_min_32_chars_12345678901234567890"

# ============================================
# NODE ENVIRONMENT
# ============================================
# Set to 'development' for local work
NODE_ENV="development"
\`\`\`

---

## Step 3: Get Your Credentials

### 3.1 Database (Neon)

1. Go to https://console.neon.tech
2. Sign up or log in
3. Create a new project named "thesis-repo"
4. In the connection string, copy the entire PostgreSQL URL
5. Paste it as `DATABASE_URL` in `.env.local`

**Example format:**
\`\`\`
DATABASE_URL="postgresql://neondb_owner:xxxxx@ep-abc123.us-east-1.neon.tech/neondb?sslmode=require"
\`\`\`

### 3.2 Email Service

#### Option A: Resend (Recommended - Free tier available)

1. Go to https://resend.com
2. Sign up with your email
3. Go to https://resend.com/api-keys
4. Copy your API Key
5. Paste as `RESEND_API_KEY` in `.env.local`
6. Set `EMAIL_PROVIDER="resend"`

**Note for Local Development:**
- Resend's free tier has testing mode
- Emails get redirected to a test email: `sharif.sazid.3@gmail.com`
- This is already configured in `lib/email/send.ts`
- To use your own domain in production, verify it in Resend dashboard

#### Option B: SendGrid

1. Go to https://sendgrid.com
2. Sign up and verify your email
3. Go to Settings → API Keys
4. Create a new API Key (Full Access recommended)
5. Copy the key
6. Paste as `SENDGRID_API_KEY` in `.env.local`
7. Set `EMAIL_PROVIDER="sendgrid"`
8. Verify your sender email in SendGrid

#### Option C: Console Mode (For Testing Without Email Service)

Don't set `RESEND_API_KEY` or `SENDGRID_API_KEY`. Emails will be logged to console:
\`\`\`env
EMAIL_PROVIDER="console"
\`\`\`

**Output looks like:**
\`\`\`
[EMAIL CONSOLE MODE] Email would be sent to: user@example.com with subject: Welcome to Thesis Repository
\`\`\`

---

## Step 4: Configure Email Sending

### Where Emails Are Sent In Your App

The email sending configuration is in: **`lib/email/send.ts`**

Currently configured email notifications:
1. **User Registration Pending** - Sent to user when they register
2. **Admin Notification** - Sent to `ADMIN_EMAIL` for new registrations
3. **Registration Approved** - Sent to user when admin approves
4. **Registration Rejected** - Sent to user when admin rejects

### File Locations That Use Email

\`\`\`
lib/email/send.ts          ← Main email sending logic
app/actions/auth.ts        ← Sends registration emails
app/actions/admin.ts       ← Sends approval/rejection emails
\`\`\`

### Testing Emails Locally

1. Set `EMAIL_PROVIDER="console"` in `.env.local`
2. Run your app: `npm run dev`
3. Try registering a user
4. Check your terminal - you'll see the email output
5. Then switch to a real provider when ready

---

## Step 5: Database Setup

### Create Tables in Neon

After configuring `DATABASE_URL`, run the database initialization script:

\`\`\`bash
# Navigate to scripts folder
cd scripts

# Run the database setup script
node database-setup.js
\`\`\`

Or manually:

1. Go to https://console.neon.tech
2. Click on your project
3. Go to "SQL Editor"
4. Copy all SQL from `scripts/database-setup.sql`
5. Paste and execute

### Verify Database Connection

\`\`\`bash
# From project root
npm run dev
\`\`\`

If database is not connected, you'll see errors in the terminal. Fix the `DATABASE_URL` format.

---

## Step 6: Run Your Application

\`\`\`bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# App will be available at:
# http://localhost:3000
\`\`\`

---

## Complete `.env.local` Example

\`\`\`env
# Database
DATABASE_URL="postgresql://user:pass@ep-abc.us-east-1.neon.tech/thesis?sslmode=require"

# Email Configuration
EMAIL_PROVIDER="resend"
RESEND_API_KEY="re_abc123def456"
EMAIL_FROM="noreply@thesis-repo.com"

# Site Configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Admin
ADMIN_EMAIL="your-email@gmail.com"

# Auth
JWT_SECRET="abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"

# Environment
NODE_ENV="development"
\`\`\`

---

## Troubleshooting

### Issue: "DATABASE_URL is required"

**Solution:** 
- Verify `DATABASE_URL` is in `.env.local` (not `.env`)
- Check the format is a valid PostgreSQL URL
- Restart your dev server after adding the variable

### Issue: "RESEND_API_KEY not configured"

**Solution:**
- Emails will work in console mode (just logged)
- For actual emails: add key to `.env.local` and restart dev server
- Check API key format: should start with `re_`

### Issue: Emails not being sent

**Solution:**
- Check `EMAIL_PROVIDER` value in `.env.local`
- If using Resend: verify domain (or use test mode)
- If using SendGrid: verify sender email is approved
- Check console logs for detailed error messages

### Issue: Can't connect to database

**Solution:**
- Verify PostgreSQL URL format
- Check Neon dashboard for active connection
- Try connection string from Neon console directly
- Ensure `.env.local` has no typos

---

## Summary of All Environment Variables

| Variable | Required | Where to Get | Used In |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✓ Yes | Neon Dashboard | `lib/db.ts` |
| `EMAIL_PROVIDER` | ✓ Yes | Choose: resend/sendgrid/console | `lib/email/send.ts` |
| `RESEND_API_KEY` | If using Resend | https://resend.com/api-keys | `lib/email/send.ts` |
| `SENDGRID_API_KEY` | If using SendGrid | https://app.sendgrid.com/settings/api_keys | `lib/email/send.ts` |
| `EMAIL_FROM` | Optional | Your email domain | `lib/email/send.ts` |
| `NEXT_PUBLIC_SITE_URL` | ✓ Yes | Your domain (localhost:3000 for dev) | `app/actions/auth.ts`, `app/actions/admin.ts` |
| `ADMIN_EMAIL` | Optional | Your email | `app/actions/auth.ts` (default: admin@thesis.com) |
| `JWT_SECRET` | Optional | Generate random | Session management |
| `NODE_ENV` | Optional | development/production | `lib/email/send.ts` |

---

## Next Steps

1. Create `.env.local` in project root
2. Add all required variables
3. Set up Neon database
4. Choose email provider (or use console for testing)
5. Run `npm run dev`
6. Test registration → you'll see emails logged
7. Verify everything works

---

## Quick Reference Commands

\`\`\`bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Start development
npm run dev

# View database schema
# Go to Neon console → SQL Editor

# Test email functionality
# Register a user on http://localhost:3000/register
# Check terminal for email output
\`\`\`

---

## File Reference

Here's where each environment variable is used in your codebase:

\`\`\`
DATABASE_URL
├── lib/db.ts (line 4)
├── lib/db/theses.ts (line 5)
└── app/actions/profile.ts (line 6)

EMAIL_PROVIDER & Email Keys
├── lib/email/send.ts (lines 1-90)
│   ├── Resend: line 20-64
│   ├── SendGrid: line 69-87
│   └── Console: default fallback
└── app/actions/auth.ts (line 93)
└── app/actions/admin.ts (line 49, 73)

NEXT_PUBLIC_SITE_URL
├── app/actions/auth.ts (line 94)
├── app/actions/admin.ts (line 49, 73)
└── middleware.ts

ADMIN_EMAIL
└── app/actions/auth.ts (line 93)

JWT_SECRET
└── lib/auth.ts (session management)

NODE_ENV
└── lib/email/send.ts (line 30)
└── lib/utils/cookies.ts (line 10)
\`\`\`

---

## Production Deployment (Vercel)

When deploying to Vercel, add these variables in:

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add each variable for Production/Preview/Development
4. Variables will be read automatically

**In `vercel.json`**, the mapping is:
\`\`\`json
{
  "env": {
    "DATABASE_URL": "@database_url",
    "JWT_SECRET": "@jwt_secret",
    "NEXT_PUBLIC_SITE_URL": "@site_url",
    "EMAIL_PROVIDER": "@email_provider"
  }
}
\`\`\`

The `@` prefix means "use Vercel secrets" (configure in Project Settings).
