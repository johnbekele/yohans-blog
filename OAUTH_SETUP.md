# OAuth Setup Guide

## Backend Configuration

Add these environment variables to your `.env` file or Render dashboard:

```env
OAUTH_CLIENT_ID=your-google-client-id
OAUTH_CLIENT_SECRET=your-google-client-secret
OAUTH_REDIRECT_URI=https://your-frontend-url.com/oauth/callback
```

For local development:
```env
OAUTH_REDIRECT_URI=http://localhost:5174/oauth/callback
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URI:
   - `http://localhost:5174/oauth/callback` (for local)
   - `https://your-frontend-url.com/oauth/callback` (for production)
7. Copy Client ID and Client Secret
8. Add them to your environment variables

## How It Works

1. User clicks "Sign in with Google" button
2. Redirects to Google OAuth consent screen
3. User authorizes the app
4. Google redirects back with authorization code
5. Backend exchanges code for user info
6. Backend creates/updates user and returns JWT tokens
7. Frontend stores tokens and logs user in

## Features

- Automatic user creation on first OAuth login
- Links OAuth account to existing email if user exists
- Returns standard JWT tokens (same as email/password login)
- Clean, minimal implementation

