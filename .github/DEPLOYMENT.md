# Deployment Setup

This document explains how to set up automated deployment of Supabase functions.

## Required GitHub Secrets

To enable automatic deployment of Supabase functions, you need to configure the following secrets in your GitHub repository:

### 1. SUPABASE_ACCESS_TOKEN
- **Description**: Personal access token for Supabase CLI
- **How to get it**: 
  1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
  2. Click on your profile → "Access Tokens"
  3. Generate a new token with appropriate permissions
  4. Copy the token value

### 2. SUPABASE_PROJECT_REF
- **Description**: Your Supabase project reference ID
- **How to get it**: 
  1. Go to your Supabase project dashboard
  2. Go to Settings → General
  3. Copy the "Reference ID" value
  4. **Current value**: `madeprjbbnaanhhsxxav` (from your config.toml)

### 3. RESEND_API_KEY
- **Description**: API key for Resend email service
- **How to get it**: 
  1. Go to [Resend Dashboard](https://resend.com/dashboard)
  2. Navigate to API Keys
  3. Create a new API key
  4. Copy the key value

## Setting Up GitHub Secrets

1. Go to your GitHub repository
2. Click on "Settings" tab
3. In the left sidebar, click "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Add each secret with the name and value as described above

## How the Workflow Works

The GitHub workflow (`deploy-supabase.yml`) will:

1. **Trigger on**:
   - Push to `main` branch with changes to `supabase/functions/**` or `supabase/config.toml`
   - Manual trigger via workflow dispatch

2. **Deploy process**:
   - Install Supabase CLI
   - Link to your Supabase project
   - Run database migrations to create required tables
   - Deploy all functions in the `supabase/functions` directory
   - Set necessary environment variables/secrets for the functions

3. **Functions deployed**:
   - `send-waitlist-notification` - Handles email notifications for waitlist signups

## Local Development

To work with Supabase functions locally:

```bash
# Install Supabase CLI
npm install -g supabase@latest

# Link your project
supabase link --project-ref madeprjbbnaanhhsxxav

# Start local development
supabase start

# Run migrations locally
supabase db push

# Deploy functions manually
supabase functions deploy

# Set secrets locally
supabase secrets set RESEND_API_KEY="your-resend-api-key"
```

## Troubleshooting

If the deployment fails:

1. Check that all required secrets are set correctly
2. Verify the Supabase project reference ID is correct
3. Ensure the Supabase access token has sufficient permissions
4. Check the workflow logs for specific error messages