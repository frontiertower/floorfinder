# Vercel KV Setup Instructions

To make room data persist across deployments, you need to set up Vercel KV (Redis):

## Steps to configure Vercel KV:

1. **Go to your Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Navigate to your `floorfinder` project

2. **Add KV Database**
   - Go to the **Storage** tab in your project
   - Click **Create Database**
   - Select **KV (Redis)**
   - Choose a database name (e.g., `floorfinder-rooms`)
   - Select a region (preferably closest to your users)
   - Click **Create**

3. **Connect to Project**
   - After creation, click **Connect Project**
   - Select your `floorfinder` project
   - Choose the environments to connect (Production, Preview, Development)
   - Click **Connect**

4. **Environment Variables**
   - Vercel will automatically add these environment variables:
     - `KV_URL`
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`
     - `KV_REST_API_READ_ONLY_TOKEN`

5. **Redeploy**
   - After connecting KV, redeploy your application
   - The rooms data will now persist across deployments

## Manual Environment Setup (if needed)

If you need to set up manually or for local development:

1. Pull the environment variables:
   ```bash
   npx vercel env pull .env.local
   ```

2. For production, the variables will be automatically available

## Verification

Once set up, your room data will:
- Persist across deployments
- Be stored in Redis/KV instead of memory
- Show "Using Vercel KV" instead of "Vercel KV not configured" in logs

## Current Status

Without KV configured, rooms are stored in memory and will be lost on each deployment.
With KV configured, rooms are persisted permanently.